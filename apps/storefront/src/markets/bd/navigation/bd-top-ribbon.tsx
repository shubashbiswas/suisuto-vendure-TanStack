import { Suspense } from "react";
import { Phone, Sparkles } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";
import { RegionPicker } from "@/site/navigation/navbar/region-picker";
import { CurrencyPicker } from "@/site/navigation/navbar/currency-picker";
import { ThemeSwitcher } from "@/site/navigation/navbar/theme-switcher";
import type { MarketRegion, RegionConfig } from "@/platform/region/region.types";
import { bdConfig } from "../bd.config";

interface BdTopRibbonProps {
	activeRegion?: MarketRegion;
	availableRegions?: RegionConfig[];
	availableCurrencyCodes: string[];
	activeCurrencyCode: string;
	campaignAnnouncement?: string;
}

export function BdTopRibbon({
	activeRegion,
	availableRegions,
	availableCurrencyCodes,
	activeCurrencyCode,
	campaignAnnouncement,
}: BdTopRibbonProps) {
	const defaultAnnouncements = [
		"Complimentary Nationwide Delivery Across Bangladesh on Orders Over ৳2500",
		"Authentic Dhakai Jamdani, Tangail Muslin & Sartorial Silks",
		`Customer Support Hotline: ${bdConfig.supportPhone} (${bdConfig.supportHours})`,
		"Festive & Eid Haute Couture Collection 2026 Now Live",
	];

	const tickerItems = campaignAnnouncement
		? [campaignAnnouncement, ...defaultAnnouncements]
		: defaultAnnouncements;

	return (
		<div className="border-b border-border/40 bg-secondary/30 text-foreground text-xs font-sans tracking-wide">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-10 gap-4">
					{/* Left: About Us | Contact Us */}
					<div className="hidden md:flex items-center gap-2.5 text-xs text-muted-foreground shrink-0 font-medium">
						<Link
							href="/page/about-us"
							className="hover:text-foreground transition-colors uppercase tracking-wider text-[11px]"
						>
							About Us
						</Link>
						<span className="text-border/80">|</span>
						<Link
							href="/page/contact-us"
							className="hover:text-foreground transition-colors uppercase tracking-wider text-[11px]"
						>
							Contact Us
						</Link>
					</div>

					{/* Center: Moving Announcements Ticker */}
					<div className="flex-1 overflow-hidden relative select-none py-1">
						<div className="flex animate-marquee whitespace-nowrap">
							<div className="flex items-center gap-8 px-4">
								{tickerItems.map((item, idx) => (
									<span
										key={`bd-a-${idx}`}
										className="inline-flex items-center gap-2.5 text-[11px] font-medium tracking-wide text-foreground/90 uppercase"
									>
										<span>{item}</span>
										<Sparkles className="size-2.5 text-amber-500 shrink-0" />
									</span>
								))}
							</div>
							<div className="flex items-center gap-8 px-4" aria-hidden="true">
								{tickerItems.map((item, idx) => (
									<span
										key={`bd-b-${idx}`}
										className="inline-flex items-center gap-2.5 text-[11px] font-medium tracking-wide text-foreground/90 uppercase"
									>
										<span>{item}</span>
										<Sparkles className="size-2.5 text-amber-500 shrink-0" />
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Right: Track Order | Call +8801308058580 + Region/Currency */}
					<div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
						<Link
							href="/account/orders"
							className="hidden lg:inline-flex hover:text-foreground text-muted-foreground transition-colors uppercase tracking-wider text-[11px] font-medium"
						>
							Track Order
						</Link>

						<span className="hidden lg:inline text-border/80">|</span>

						<a
							href={`tel:${bdConfig.supportPhone}`}
							className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors text-[11px] tracking-wide"
						>
							<Phone className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
							<span className="font-semibold">{bdConfig.supportPhone}</span>
						</a>

						<div className="hidden sm:block h-3.5 w-px bg-border/60 ml-1" />

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
							<ThemeSwitcher />
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
