import { Sparkles, Truck, ShieldCheck, Lock, Phone, Mail, MapPin } from "lucide-react";
import { NavigationLink } from "@/site/navigation/navigation-link";
import { RegionPicker } from "@/site/navigation/navbar/region-picker";
import type { MarketFooterProps } from "../types";
import { inConfig } from "./in.config";

const COPYRIGHT_YEAR = 2026;

export function InFooter({
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
								<Truck className="size-4 text-primary" />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wider uppercase">Pan-India Express</p>
								<p className="text-[11px] text-muted-foreground">Delhivery Priority Across 28 States</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="size-9 rounded-full bg-primary/5 border border-border/60 flex items-center justify-center shrink-0">
								<Sparkles className="size-4 text-primary" />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wider uppercase">Certified Handloom</p>
								<p className="text-[11px] text-muted-foreground">Varanasi, Chanderi & Bengal Silks</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="size-9 rounded-full bg-primary/5 border border-border/60 flex items-center justify-center shrink-0">
								<ShieldCheck className="size-4 text-primary" />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wider uppercase">Easy 7-Day Exchange</p>
								<p className="text-[11px] text-muted-foreground">Doorstep pickup & fit exchange</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="size-9 rounded-full bg-primary/5 border border-border/60 flex items-center justify-center shrink-0">
								<Lock className="size-4 text-primary" />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wider uppercase">Instant UPI & COD</p>
								<p className="text-[11px] text-muted-foreground">Razorpay, UPI, RuPay & Cash on Delivery</p>
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
						<NavigationLink href="/in" className="inline-flex items-center gap-3.5 leading-none select-none group">
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
									India Atelier · New Delhi
								</span>
							</div>
						</NavigationLink>
						<p className="text-xs text-muted-foreground leading-relaxed max-w-sm font-sans pt-1">
							Honoring the grandeur of Indian textiles and sartorial craftsmanship. Direct studio fulfillment from New Delhi and Varanasi ateliers.
						</p>

						<div className="space-y-1.5 text-xs text-muted-foreground pt-1">
							{inConfig.supportEmail && (
								<p className="flex items-center gap-2">
									<Mail className="size-3.5 text-primary shrink-0" />
									<a href={`mailto:${inConfig.supportEmail}`} className="hover:text-foreground">
										{inConfig.supportEmail}
									</a>
								</p>
							)}
							{inConfig.supportPhone && (
								<p className="flex items-center gap-2">
									<Phone className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
									<a href={`tel:${inConfig.supportPhone}`} className="hover:text-foreground font-semibold text-foreground">
										{inConfig.supportPhone}
									</a>
								</p>
							)}
							{inConfig.address && (
								<p className="flex items-center gap-2">
									<MapPin className="size-3.5 text-primary shrink-0" />
									<span>{inConfig.address}</span>
								</p>
							)}
						</div>
					</div>

					{/* The Collections */}
					<div className="md:col-span-2 space-y-3">
						<p className="text-xs font-semibold uppercase tracking-widest text-foreground">
							Collections
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
							Customer Care
						</p>
						<ul className="space-y-2 text-xs text-muted-foreground">
							<li>
								<NavigationLink href="/account/orders" className="hover:text-foreground transition-colors">
									Track Delhivery Order
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
									Bespoke Bridal Consultation
								</span>
							</li>
							<li>
								<span className="hover:text-foreground transition-colors cursor-pointer">
									GST Invoice & KYC Guide
								</span>
							</li>
						</ul>
					</div>

					{/* Market Preference & Dispatch */}
					<div className="md:col-span-3 space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-foreground">
							Regional Market
						</p>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Serving all 28 states and 8 union territories in INR (₹) with all domestic taxes included.
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
						<p>&copy; {COPYRIGHT_YEAR} SUISUTO INDIA ATELIER. All Rights Reserved.</p>
						<span>·</span>
						<span className="hover:text-foreground transition-colors cursor-pointer">Privacy Protocol</span>
						<span>·</span>
						<span className="hover:text-foreground transition-colors cursor-pointer">Terms & Conditions</span>
					</div>

					<div className="flex items-center gap-3 text-[11px] tracking-wider uppercase text-muted-foreground/80">
						<span className="font-semibold text-emerald-600">UPI</span>
						<span>·</span>
						<span className="font-semibold text-sky-600">RuPay</span>
						<span>·</span>
						<span>NetBanking</span>
						<span>·</span>
						<span>Visa</span>
						<span>·</span>
						<span>Mastercard</span>
						<span>·</span>
						<span className="font-semibold text-amber-600">COD</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
