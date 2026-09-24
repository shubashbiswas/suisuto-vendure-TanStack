import { getMarketExperience } from "@/markets";
import { useActiveRegion } from "@/platform/tanstack/navigation";
import type { MarketHeaderProps } from "@/markets";

export type NavbarProps = MarketHeaderProps;

export function Navbar(props: MarketHeaderProps) {
	const routeRegion = useActiveRegion();
	const activeRegion = routeRegion || props.activeRegion || "global";
	const market = getMarketExperience(activeRegion);
	const Header = market.Header;

	return <Header {...props} activeRegion={activeRegion} />;
}
