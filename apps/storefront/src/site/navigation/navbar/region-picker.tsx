import { useEffect, useState, useTransition } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { switchRegion } from "@/platform/region/switch-region.functions";
import {
	createRegionConfig,
	getCurrencySymbol,
	type MarketRegion,
	type RegionConfig,
} from "@/platform/region/region.types";
import { MarketSwitchConfirmDialog } from "@/features/market/market-switch-confirm-dialog";

const rootRoute = getRouteApi("__root__");

interface RegionPickerProps {
	activeRegion?: MarketRegion;
	activeCurrencyCode?: string;
	availableRegions?: RegionConfig[];
	cartItemCount?: number;
	side?: "top" | "bottom";
	align?: "start" | "end" | "center";
}

export function RegionPicker({
	activeRegion = "global",
	activeCurrencyCode,
	availableRegions,
	cartItemCount,
	side = "top",
	align = "start",
}: RegionPickerProps) {
	const [isPending, startTransition] = useTransition();
	const changeRegion = useServerFn(switchRegion);
	const rootData = rootRoute.useLoaderData();

	const [activeCartCount, setActiveCartCount] = useState<number>(cartItemCount ?? 0);
	const [pendingRegion, setPendingRegion] = useState<RegionConfig | null>(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	useEffect(() => {
		if (cartItemCount !== undefined) {
			setActiveCartCount(cartItemCount);
		} else if (rootData?.personalized) {
			rootData.personalized.then((p: any) => {
				if (typeof p?.cartItemCount === "number") {
					setActiveCartCount(p.cartItemCount);
				}
			}).catch(() => {});
		}
	}, [cartItemCount, rootData]);

	const current =
		(availableRegions &&
			availableRegions.find(
				(r) => r.code === activeRegion || r.token === activeRegion,
			)) ||
		createRegionConfig({ code: activeRegion });

	const currencySymbol = activeCurrencyCode
		? getCurrencySymbol(activeCurrencyCode)
		: current.symbol;

	// Purely dynamic market list supplied by Vendure backend API
	const list: RegionConfig[] =
		availableRegions && availableRegions.length > 0
			? availableRegions
			: [current];

	const executeSwitch = (reg: RegionConfig) => {
		startTransition(async () => {
			await changeRegion({ data: { region: reg.code } });
			const targetUrl = reg.code === "global" ? "/" : `/${reg.code}`;
			window.location.href = targetUrl;
		});
	};

	const handleRegionChange = (reg: RegionConfig) => {
		if (reg.code === activeRegion || reg.token === activeRegion) {
			return;
		}
		if (activeCartCount > 0) {
			setPendingRegion(reg);
			setIsConfirmOpen(true);
			return;
		}
		executeSwitch(reg);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="sm"
							className="gap-1.5 px-2 text-xs font-medium border border-border/40 hover:border-primary/40 transition-colors"
							aria-label={`Select Market Region (${current.name} - ${currencySymbol})`}
						>
							<span className="text-sm">{current.flag}</span>
							<span className="font-semibold text-xs">{currencySymbol}</span>
						</Button>
					}
				/>
				<DropdownMenuContent align={align} side={side} className="w-56 p-1.5 shadow-xl border-border/60">
					<DropdownMenuGroup>
						<DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-1.5">
							Select Market & Region
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{list.map((reg) => {
							const isSelected =
								activeRegion === reg.code || activeRegion === reg.token;
							return (
								<DropdownMenuItem
									key={reg.code}
									onClick={() => handleRegionChange(reg)}
									disabled={isPending}
									className={`flex items-center justify-between p-2 rounded-none cursor-pointer text-xs ${
										isSelected ? "bg-accent/60 font-medium" : ""
									}`}
								>
									<div className="flex items-center gap-2.5">
										<span className="text-base">{reg.flag}</span>
										<div className="flex flex-col">
											<span className="font-medium text-foreground">{reg.name}</span>
											<span className="text-[10px] text-muted-foreground">
												{reg.currencyCode} ({reg.symbol})
											</span>
										</div>
									</div>
									{isSelected && (
										<span className="text-primary font-bold text-xs ml-2">✓</span>
									)}
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<MarketSwitchConfirmDialog
				open={isConfirmOpen}
				onOpenChange={setIsConfirmOpen}
				currentRegionName={current.name}
				currentCurrency={current.currencyCode}
				targetRegion={pendingRegion}
				cartItemCount={activeCartCount}
				onConfirm={() => {
					setIsConfirmOpen(false);
					if (pendingRegion) {
						executeSwitch(pendingRegion);
					}
				}}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</>
	);
}
