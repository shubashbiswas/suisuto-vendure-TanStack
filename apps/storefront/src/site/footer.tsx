import { getMarketExperience } from "@/markets";
import { useActiveRegion } from "@/platform/tanstack/navigation";
import type { MarketFooterProps } from "@/markets";

export type FooterProps = MarketFooterProps;

export function Footer(props: MarketFooterProps) {
	const routeRegion = useActiveRegion();
	const activeRegion = routeRegion || props.activeRegion || "global";
	const market = getMarketExperience(activeRegion);
	const FooterComponent = market.Footer;

	return <FooterComponent {...props} activeRegion={activeRegion} />;
}
