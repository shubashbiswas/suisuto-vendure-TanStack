import type { MarketExperienceModule } from "../types";
import { BdHeader } from "./bd-header";
import { BdFooter } from "./bd-footer";
import { bdConfig } from "./bd.config";

export const bdMarket: MarketExperienceModule = {
	Header: BdHeader,
	Footer: BdFooter,
	config: bdConfig,
};

export { BdHeader, BdFooter, bdConfig };
