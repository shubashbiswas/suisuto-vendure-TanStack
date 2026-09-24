import type { MarketExperienceModule } from "../types";
import { InHeader } from "./in-header";
import { InFooter } from "./in-footer";
import { inConfig } from "./in.config";

export const inMarket: MarketExperienceModule = {
	Header: InHeader,
	Footer: InFooter,
	config: inConfig,
};

export { InHeader, InFooter, inConfig };
