import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import maxmind, { CountryResponse } from 'maxmind';
import { GeoIpHybridService } from './geoip-hybrid.service';

export interface UpdateMaxMindDatabaseResult {
    success: boolean;
    message: string;
    bytesDownloaded?: number;
    databasePath?: string;
    lastModified?: string;
}

/**
 * Extracts a .mmdb binary buffer from a POSIX USTAR tar buffer without external dependencies.
 */
export function extractMmdbFromTar(tarBuffer: Buffer): Buffer | null {
    let offset = 0;
    while (offset < tarBuffer.length - 512) {
        const filename = tarBuffer.toString('utf-8', offset, offset + 100).replace(/\0.*$/, '').trim();
        if (!filename) break;

        const sizeStr = tarBuffer.toString('utf-8', offset + 124, offset + 136).replace(/\0.*$/, '').trim();
        const size = parseInt(sizeStr, 8) || 0;

        offset += 512;
        if (filename.endsWith('.mmdb') && size > 0) {
            return tarBuffer.subarray(offset, offset + size);
        }
        offset += Math.ceil(size / 512) * 512;
    }
    return null;
}

@Injectable()
export class GeoIpDownloaderService {
    private readonly logger = new Logger('GeoIpDownloaderService');
    private isUpdating = false;

    constructor(private geoIpService: GeoIpHybridService) {}

    /**
     * Downloads and hot-reloads the MaxMind GeoLite2 Country database.
     */
    async downloadAndReload(options?: {
        licenseKey?: string;
        customUrl?: string;
        targetPath?: string;
    }): Promise<UpdateMaxMindDatabaseResult> {
        if (this.isUpdating) {
            return {
                success: false,
                message: 'A MaxMind database update is already in progress.',
            };
        }

        this.isUpdating = true;
        try {
            const licenseKey = options?.licenseKey || process.env.MAXMIND_LICENSE_KEY;
            let downloadUrl = options?.customUrl || process.env.MAXMIND_DOWNLOAD_URL;

            if (!downloadUrl) {
                if (licenseKey && licenseKey.trim().length > 0) {
                    downloadUrl = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${encodeURIComponent(licenseKey.trim())}&suffix=tar.gz`;
                } else {
                    // Verified automated GitHub mirror updated weekly from MaxMind releases
                    downloadUrl = 'https://raw.githubusercontent.com/P3TERX/GeoLite.mmdb/download/GeoLite2-Country.mmdb';
                }
            }

            this.logger.log(`Starting MaxMind database download from: ${downloadUrl.replace(/license_key=[^&]+/, 'license_key=***')}`);

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

            const response = await fetch(downloadUrl, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Suisuto-Vendure-GeoIP/1.0',
                    Accept: 'application/octet-stream, application/x-gzip, application/gzip, */*',
                },
                redirect: 'follow',
            });
            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`Download failed with HTTP ${response.status}: ${response.statusText}`);
            }

            const rawBuffer = Buffer.from(await response.arrayBuffer());
            if (rawBuffer.length < 50000) {
                // If response is too small, check if it returned an HTML error page or text
                const sampleText = rawBuffer.toString('utf-8', 0, Math.min(rawBuffer.length, 300));
                throw new Error(`Invalid database payload (${rawBuffer.length} bytes): ${sampleText}`);
            }

            let mmdbBuffer: Buffer | null = null;

            // Check if gzipped (magic bytes 0x1f 0x8b)
            if (rawBuffer[0] === 0x1f && rawBuffer[1] === 0x8b) {
                const decompressed = zlib.gunzipSync(rawBuffer);
                // Check if the decompressed payload is a tar archive or raw mmdb
                const fromTar = extractMmdbFromTar(decompressed);
                mmdbBuffer = fromTar || decompressed;
            } else {
                mmdbBuffer = rawBuffer;
            }

            if (!mmdbBuffer || mmdbBuffer.length < 100000) {
                throw new Error('Failed to extract valid GeoLite2-Country.mmdb binary from payload.');
            }

            // Determine target write path
            let targetPath = options?.targetPath || process.env.MAXMIND_DB_PATH;
            if (!targetPath) {
                const cwd = process.cwd();
                if (cwd.endsWith('server') || cwd.endsWith('server\\') || cwd.endsWith('server/')) {
                    targetPath = path.resolve(cwd, 'data/GeoLite2-Country.mmdb');
                } else {
                    targetPath = path.resolve(cwd, 'apps/server/data/GeoLite2-Country.mmdb');
                }
            }

            const targetDir = path.dirname(targetPath);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            // Write to temporary file first
            const tempPath = `${targetPath}.${Date.now()}.tmp`;
            fs.writeFileSync(tempPath, mmdbBuffer);

            // Verify integrity by testing MaxMind reader initialization on the temp file
            try {
                const testReader = await maxmind.open<CountryResponse>(tempPath);
                if (!testReader) {
                    throw new Error('MaxMind reader failed to parse binary file.');
                }
            } catch (err: any) {
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
                throw new Error(`MaxMind database binary verification failed: ${err.message}`);
            }

            // Atomically replace target database file
            fs.renameSync(tempPath, targetPath);

            // Hot-reload reader in GeoIpHybridService without server downtime
            await this.geoIpService.reloadReader(targetPath);

            const stats = fs.statSync(targetPath);
            const lastModified = stats.mtime.toISOString();

            this.logger.log(`MaxMind database successfully updated and hot-reloaded: ${targetPath} (${mmdbBuffer.length} bytes)`);

            return {
                success: true,
                message: `MaxMind MMDB successfully updated and hot-reloaded (${(mmdbBuffer.length / 1024 / 1024).toFixed(2)} MB).`,
                bytesDownloaded: mmdbBuffer.length,
                databasePath: targetPath,
                lastModified,
            };
        } catch (err: any) {
            this.logger.error(`MaxMind update error: ${err.message}`);
            return {
                success: false,
                message: `MaxMind update failed: ${err.message}`,
            };
        } finally {
            this.isUpdating = false;
        }
    }
}
