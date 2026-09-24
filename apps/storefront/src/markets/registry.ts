import { bdMarket } from "./bd";
import { inMarket } from "./in";
import { globalMarket } from "./global";
import type { MarketExperienceModule } from "./types";

const marketRegistry: Record<string, MarketExperienceModule> = {
	bd: bdMarket,
	bangladesh: bdMarket,
	in: inMarket,
	india: inMarket,
	global: globalMarket,
};

export function getMarketExperience(regionCode?: string | null): MarketExperienceModule {
	const normalized = (regionCode || "global").toLowerCase().trim();
	return marketRegistry[normalized] || marketRegistry.global;
}

export { bdMarket, inMarket, globalMarket };
