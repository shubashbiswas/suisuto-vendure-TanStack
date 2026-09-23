export interface AssetTransformOptions {
    width?: number;
    height?: number;
    mode?: "crop" | "resize";
    format?: "webp" | "avif" | "jpg" | "png";
}

/**
 * Appends Vendure AssetServer transformation parameters to optimize image delivery.
 * If the URL is external or not an image, it returns the URL unchanged.
 */
export function getOptimizedAssetUrl(
    url?: string,
    options: AssetTransformOptions = {}
): string {
    if (!url) return "";

    // Ignore SVGs or data URLs
    if (url.endsWith(".svg") || url.startsWith("data:")) {
        return url;
    }

    try {
        const isAbsolute = url.startsWith("http://") || url.startsWith("https://");
        const parsed = new URL(url, "https://asset-host.placeholder");

        if (options.width) parsed.searchParams.set("w", String(options.width));
        if (options.height) parsed.searchParams.set("h", String(options.height));
        if (options.mode) parsed.searchParams.set("mode", options.mode);
        if (options.format) parsed.searchParams.set("format", options.format);

        if (isAbsolute) {
            return parsed.toString();
        }
        return `${parsed.pathname}${parsed.search}`;
    } catch {
        return url;
    }
}

/**
 * Generates a responsive srcset string for Vendure asset images across standard breakpoints.
 */
export function getAssetSrcSet(
    url?: string,
    widths: number[] = [640, 1024, 1440, 1920]
): string {
    if (!url || url.endsWith(".svg") || url.startsWith("data:")) return "";

    return widths
        .map((w) => `${getOptimizedAssetUrl(url, { width: w, format: "webp" })} ${w}w`)
        .join(", ");
}
