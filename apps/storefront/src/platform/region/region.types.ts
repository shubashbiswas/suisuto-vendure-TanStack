export type MarketRegion = string;

export interface RegionConfig {
	code: string;
	token: string;
	name: string;
	currencyCode: string;
	availableCurrencyCodes: string[];
	symbol: string;
	flag: string;
	hubName: string;
	/** BCP-47 language code of the channel (e.g. 'en', 'bn', 'hi') */
	defaultLanguageCode?: string;
	/** All BCP-47 language codes available on this channel */
	availableLanguageCodes: string[];
}

/**
 * Universal Unicode Flag Generator.
 * Dynamically converts any 2-letter ISO country code (BD, IN, AE, US, GB, etc.)
 * to its official regional flag emoji with zero hardcoding.
 */
export function getCountryFlag(codeOrName?: string): string {
	if (!codeOrName) return "🌐";
	const clean = codeOrName.trim().toUpperCase();

	// ISO 3166-1 alpha-2 standard country codes
	if (clean.length === 2 && /^[A-Z]{2}$/.test(clean)) {
		return String.fromCodePoint(
			...clean.split("").map((c) => 127397 + c.charCodeAt(0)),
		);
	}

	return "🌐";
}

/**
 * Universal Currency Symbol Formatter.
 * Resolves standard localized symbols (৳, ₹, $, €, £, etc.) dynamically.
 */
export function getCurrencySymbol(currencyCode: string): string {
	try {
		const formatted = (0).toLocaleString("en-US", {
			style: "currency",
			currency: currencyCode.toUpperCase(),
			currencyDisplay: "narrowSymbol",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});
		const symbol = formatted.replace(/[\d\s.,]/g, "").trim();
		return symbol || currencyCode.toUpperCase();
	} catch {
		return currencyCode.toUpperCase();
	}
}

/**
 * Factory to construct a complete RegionConfig from dynamic channel metadata.
 */
export function createRegionConfig(input: {
	code: string;
	token?: string;
	name?: string;
	currencyCode?: string;
	hubName?: string;
	defaultLanguageCode?: string;
	availableLanguageCodes?: string[];
	availableCurrencyCodes?: string[];
}): RegionConfig {
	const code = input.code.toLowerCase();
	const token = input.token !== undefined ? input.token : code;
	const currencyCode = (input.currencyCode || "USD").toUpperCase();

	let name = input.name;
	if (!name) {
		if (code === "global") {
			name = "Global";
		} else {
			try {
				name = new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) || "";
			} catch {
				name = "";
			}
			if (!name) {
				name = code.charAt(0).toUpperCase() + code.slice(1);
			}
		}
	}

	const hubName =
		input.hubName ||
		(code === "global" ? "Global Direct" : `${name} Hub`);
	const flag = getCountryFlag(code);
	const symbol = getCurrencySymbol(currencyCode);

	return {
		code,
		token,
		name,
		currencyCode,
		availableCurrencyCodes: input.availableCurrencyCodes ?? [currencyCode],
		symbol,
		flag,
		hubName,
		defaultLanguageCode: input.defaultLanguageCode,
		availableLanguageCodes: input.availableLanguageCodes ?? (input.defaultLanguageCode ? [input.defaultLanguageCode] : ['en']),
	};
}

export const DEFAULT_REGION: MarketRegion = "global";

export const DEFAULT_GLOBAL_REGION: RegionConfig = createRegionConfig({
	code: "global",
	token: "global",
	name: "Global",
	currencyCode: "USD",
	hubName: "Global Direct",
});
