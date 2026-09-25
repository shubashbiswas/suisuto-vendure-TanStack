import { Suspense } from "react";
import { Sparkles, HelpCircle, ShieldCheck } from "lucide-react";
import { RegionPicker } from "@/site/navigation/navbar/region-picker";
import { CurrencyPicker } from "@/site/navigation/navbar/currency-picker";
import { LanguagePicker } from "@/site/navigation/navbar/language-picker";
import { ThemeSwitcher } from "@/site/navigation/navbar/theme-switcher";
import { Link } from "@/platform/tanstack/navigation";
import type { MarketRegion, RegionConfig } from "@/platform/region/region.types";

interface LuxuryTopUtilityProps {
	activeRegion?: MarketRegion;
	availableRegions?: RegionConfig[];
	availableCurrencyCodes: string[];
	activeCurrencyCode: string;
}

export function LuxuryTopUtility({
	activeRegion,
	availableRegions,
	availableCurrencyCodes,
	activeCurrencyCode,
}: LuxuryTopUtilityProps) {
	return (
		<div className="border-b border-border/40 bg-secondary/25 text-foreground/80 text-[11px] font-mono tracking-wider">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-9">
					{/* Left: Provenance Assurance */}
					<div className="hidden lg:flex items-center gap-2.5 text-muted-foreground">
						<span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
						<span className="uppercase tracking-[0.25em] text-[10px]">
							Certified South Asian Handloom Provenance
						</span>
						<span className="text-border/80">•</span>
						<span className="text-foreground/75 text-[10px] tracking-wide flex items-center gap-1 font-sans">
							<ShieldCheck className="size-3 text-emerald-500 inline" />
							Discreet Worldwide Express Delivery
						</span>
					</div>

					{/* Center on mobile / small screen */}
					<div className="flex lg:hidden items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-widest truncate">
						<Sparkles className="size-3 text-amber-500 shrink-0" />
						<span className="truncate">Haute Couture Handloom & Atelier</span>
					</div>

					{/* Right: Region, Currency, Language, Theme & Concierge (hidden on mobile, managed in drawer) */}
					<div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
						<Link
							href="/#artisan-heritage"
							className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
						>
							<HelpCircle className="size-3" />
							<span>Concierge</span>
						</Link>

						<div className="hidden sm:block h-3 w-px bg-border/60" />

						<Suspense>
							<RegionPicker
								activeRegion={activeRegion}
								activeCurrencyCode={activeCurrencyCode}
								availableRegions={availableRegions}
								side="bottom"
								align="end"
							/>
						</Suspense>

						{availableCurrencyCodes.length > 1 && (
							<Suspense>
								<CurrencyPicker
									availableCurrencyCodes={availableCurrencyCodes}
									activeCurrencyCode={activeCurrencyCode}
								/>
							</Suspense>
						)}

						<Suspense>
							<LanguagePicker
								activeRegion={activeRegion}
								availableRegions={availableRegions}
							/>
						</Suspense>

						<div className="h-3 w-px bg-border/60" />

						<Suspense>
							<ThemeSwitcher />
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
