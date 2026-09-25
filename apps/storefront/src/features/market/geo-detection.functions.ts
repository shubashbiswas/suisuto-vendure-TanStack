import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export interface GeoDetectionResult {
    countryCode: string | null;
    suggestedMarket: string | null;
}

export const detectVisitorMarket = createServerFn({ method: "GET" })
    .handler(async (): Promise<GeoDetectionResult> => {
        try {
            const req = getRequest();
            const headers = req?.headers;
            if (!headers) {
                return { countryCode: null, suggestedMarket: null };
            }

            const isDev = process.env.NODE_ENV !== "production";
            let mockCountry: string | null = null;
            if (isDev) {
                mockCountry =
                    headers.get("x-mock-country") ||
                    headers.get("x-suisuto-mock-country") ||
                    process.env.DEV_MOCK_COUNTRY ||
                    null;

                if (!mockCountry && req?.url) {
                    try {
                        const parsedUrl = new URL(req.url, "http://localhost");
                        mockCountry = parsedUrl.searchParams.get("mockCountry");
                    } catch {}
                }
            }

            const rawCountry =
                mockCountry ||
                headers.get("cf-ipcountry") ||
                headers.get("x-vercel-ip-country") ||
                headers.get("cloudfront-viewer-country") ||
                headers.get("x-country-code") ||
                null;

            if (!rawCountry || rawCountry === "XX" || rawCountry === "T1") {
                return { countryCode: null, suggestedMarket: null };
            }

            const iso = rawCountry.trim().toUpperCase();
            let suggestedMarket: string | null = null;

            switch (iso) {
                case "IN":
                    suggestedMarket = "in";
                    break;
                case "BD":
                    suggestedMarket = "bd";
                    break;
                case "AE":
                    suggestedMarket = "ae";
                    break;
                case "US":
                    suggestedMarket = "us";
                    break;
                default:
                    suggestedMarket = null;
            }

            return {
                countryCode: iso,
                suggestedMarket,
            };
        } catch {
            return { countryCode: null, suggestedMarket: null };
        }
    });
