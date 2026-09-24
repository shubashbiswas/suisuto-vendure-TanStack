import type { MarketExperienceModule } from "../types";
import { GlobalHeader } from "./global-header";
import { GlobalFooter } from "./global-footer";
import { globalConfig } from "./global.config";

export const globalMarket: MarketExperienceModule = {
	Header: GlobalHeader,
	Footer: GlobalFooter,
	config: globalConfig,
};

export { GlobalHeader, GlobalFooter, globalConfig };
