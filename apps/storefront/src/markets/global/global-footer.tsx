import { Sparkles, Truck, ShieldCheck, Lock } from "lucide-react";
import { NavigationLink } from "@/site/navigation/navigation-link";
import { RegionPicker } from "@/site/navigation/navbar/region-picker";
import type { MarketFooterProps } from "../types";

const COPYRIGHT_YEAR = 2026;

export function GlobalFooter({
	collections,
	activeRegion,
	activeCurrencyCode,
	availableRegions,
}: MarketFooterProps) {
	return (
		<footer className="border-t border-border/70 bg-secondary/15 text-foreground mt-auto">
			{/* Luxury Value Proposition Bar */}
			<div className="border-b border-border/50 bg-background/50 py-8">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
						<div className="flex items-center gap-3">
							<div className="size-9 rounded-full bg-primary/5 border border-border/60 flex items-center justify-center shrink-0">
								<Sparkles className="size-4 text-primary" />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wider uppercase">Master Artisan Weaves</p>
								<p className="text-[11px] text-muted-foreground">Certified handloom provenance</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="size-9 rounded-full bg-primary/5 border border-border/60 flex items-center justify-center shrink-0">
								<Truck className="size-4 text-primary" />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wider uppercase">Express Direct Dispatch</p>
								<p className="text-[11px] text-muted-foreground">Discreet worldwide priority courier</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="size-9 rounded-full bg-primary/5 border border-border/60 flex items-center justify-center shrink-0">
								<ShieldCheck className="size-4 text-primary" />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wider uppercase">Heritage Guarantee</p>
								<p className="text-[11px] text-muted-foreground">Lifetime certificate included</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="size-9 rounded-full bg-primary/5 border border-border/60 flex items-center justify-center shrink-0">
								<Lock className="size-4 text-primary" />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wider uppercase">Encrypted Checkout</p>
								<p className="text-[11px] text-muted-foreground">Secure multi-currency transactions</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Editorial Footer Grid */}
			<div className="container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
					{/* Brand Statement Column */}
					<div className="md:col-span-5 space-y-4">
						<NavigationLink href="/" className="inline-flex items-center gap-3.5 leading-none select-none group">
							<div className="relative size-11 shrink-0 transition-transform duration-500 group-hover:scale-105">
								<img
									src="/logos/logo-s-b.webp"
									alt="Suisuto"
									className="size-full object-contain dark:hidden"
								/>
								<img
									src="/logos/logo-s-w.webp"
									alt="Suisuto"
									className="size-full object-contain hidden dark:block"
								/>
							</div>
							<div className="flex flex-col items-start">
								<span className="font-serif text-2xl font-bold tracking-[0.2em] text-foreground">
									SUISUTO
								</span>
								<span className="text-[8.5px] font-sans tracking-[0.4em] text-muted-foreground uppercase pl-0.5 mt-1 font-medium">
									Haute Couture Atelier
								</span>
							</div>
						</NavigationLink>
						<p className="text-xs text-muted-foreground leading-relaxed max-w-sm font-sans pt-1">
							Dedicated to the preservation of ancient South Asian weaving traditions through the lens of architectural tailoring. Every creation is hand-loomed by generational master artisans.
						</p>
						<div className="pt-2">
							<p className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
								Regional Atelier Dispatch
							</p>
							<p className="text-xs text-muted-foreground mt-0.5">
								Dhaka · Kolkata · Global Direct
							</p>
						</div>
					</div>

					{/* The Collections */}
					<div className="md:col-span-2 space-y-3">
						<p className="text-xs font-semibold uppercase tracking-widest text-foreground">
							The Collections
						</p>
						<ul className="space-y-2 text-xs text-muted-foreground">
							<li>
								<NavigationLink href="/collections/atelier" className="hover:text-foreground transition-colors">
									The Atelier Edit
								</NavigationLink>
							</li>
							{collections.map((collection) => (
								<li key={collection.id}>
									<NavigationLink
										href={`/collections/${collection.slug}`}
										className="hover:text-foreground transition-colors"
									>
										{collection.name}
									</NavigationLink>
								</li>
							))}
							<li>
								<NavigationLink href="/shop" className="hover:text-foreground transition-colors">
									All Runway Pieces
								</NavigationLink>
							</li>
						</ul>
					</div>

					{/* Client Concierge */}
					<div className="md:col-span-2 space-y-3">
						<p className="text-xs font-semibold uppercase tracking-widest text-foreground">
							Client Services
						</p>
						<ul className="space-y-2 text-xs text-muted-foreground">
							<li>
								<NavigationLink href="/account/orders" className="hover:text-foreground transition-colors">
									Track Shipment
								</NavigationLink>
							</li>
							<li>
								<NavigationLink href="/account/profile" className="hover:text-foreground transition-colors">
									Client Account
								</NavigationLink>
							</li>
							<li>
								<NavigationLink href="/cart" className="hover:text-foreground transition-colors">
									Shopping Bag
								</NavigationLink>
							</li>
							<li>
								<span className="hover:text-foreground transition-colors cursor-pointer">
									Bespoke Sizing Consultation
								</span>
							</li>
							<li>
								<span className="hover:text-foreground transition-colors cursor-pointer">
									Complimentary Returns
								</span>
							</li>
						</ul>
					</div>

					{/* Market Preference & Dispatch */}
					<div className="md:col-span-3 space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-foreground">
							Market & Currency
						</p>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Prices and shipping duties are automatically localized to your selected region.
						</p>
						<div className="pt-1">
							<RegionPicker
								activeRegion={activeRegion}
								activeCurrencyCode={activeCurrencyCode}
								availableRegions={availableRegions}
								side="top"
								align="start"
							/>
						</div>
					</div>
				</div>

				{/* Bottom Bar: Copyright & Compliance */}
				<div className="mt-14 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
					<div className="flex flex-wrap items-center gap-4">
						<p>&copy; {COPYRIGHT_YEAR} SUISUTO ATELIER. All Rights Reserved.</p>
						<span>·</span>
						<span className="hover:text-foreground transition-colors cursor-pointer">Privacy Protocol</span>
						<span>·</span>
						<span className="hover:text-foreground transition-colors cursor-pointer">Terms of Haute Couture</span>
					</div>

					<div className="flex items-center gap-3 text-[11px] tracking-wider uppercase text-muted-foreground/80">
						<span>Visa</span>
						<span>·</span>
						<span>Mastercard</span>
						<span>·</span>
						<span>American Express</span>
						<span>·</span>
						<span>Apple Pay</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
