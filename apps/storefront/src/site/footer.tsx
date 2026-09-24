import { NavigationLink } from "@/site/navigation/navigation-link";
import { RegionPicker } from "@/site/navigation/navbar/region-picker";
import { useActiveRegion } from "@/platform/tanstack/navigation";
import type { MarketRegion, RegionConfig } from "@/platform/region/region.types";
import { ShieldCheck, Sparkles, Truck, Lock, Phone, Mail, MapPin } from "lucide-react";

const COPYRIGHT_YEAR = 2026;

interface FooterProps {
	collections: Array<{ id: string; name: string; slug: string }>;
	activeRegion?: MarketRegion;
	activeCurrencyCode?: string;
	availableRegions?: RegionConfig[];
}

export function Footer({
	collections,
	activeRegion,
	activeCurrencyCode,
	availableRegions,
}: FooterProps) {
	const routeRegion = useActiveRegion();
	const isBd = activeRegion === "bd" || routeRegion === "bd";

	if (isBd) {
		return (
			<footer className="border-t border-border/70 bg-secondary/15 text-foreground mt-auto">
				{/* Value Proposition Strip */}
				<div className="border-b border-border/50 bg-background/60 py-6">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
									<Truck className="size-5 text-primary" />
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider">Nationwide Delivery</p>
									<p className="text-[11px] text-muted-foreground">Pathao & RedX Express Across BD</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
									<ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider">100% Authentic Handloom</p>
									<p className="text-[11px] text-muted-foreground">BSTI & Provenance Certified</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
									<Sparkles className="size-5 text-amber-600 dark:text-amber-400" />
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider">Easy Exchange</p>
									<p className="text-[11px] text-muted-foreground">7 Days Hassle-Free Returns</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
									<Lock className="size-5 text-sky-600 dark:text-sky-400" />
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider">Secure Payment</p>
									<p className="text-[11px] text-muted-foreground">bKash, Nagad, Cards & COD</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Infinity Mega Mall 4-Column Footer Menus */}
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
						{/* Col 1: Who We Are */}
						<div className="lg:col-span-4 space-y-4">
							<div className="flex items-center gap-2">
								<div className="relative size-8">
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
								<span className="font-serif text-2xl font-bold tracking-[0.2em]">
									SUISUTO / iNFINITY
								</span>
							</div>

							<p className="text-xs text-foreground font-semibold">
								Your Family Shopping Destination.
							</p>

							<p className="text-xs text-muted-foreground leading-relaxed">
								Customer Support Hours:<br />
								<span className="font-medium text-foreground">9:00 AM to 11:00 PM (Daily)</span>
							</p>

							<div className="space-y-1.5 text-xs text-muted-foreground pt-1">
								<p className="flex items-center gap-2">
									<Mail className="size-3.5 text-primary shrink-0" />
									<a href="mailto:support@suisuto.com" className="hover:text-foreground">
										support@suisuto.com
									</a>
								</p>
								<p className="flex items-center gap-2">
									<Phone className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
									<a href="tel:+8801308058580" className="hover:text-foreground font-semibold text-foreground">
										+8801308058580
									</a>
								</p>
								<p className="flex items-center gap-2">
									<MapPin className="size-3.5 text-primary shrink-0" />
									<span>Dhaka Hub · Narayanganj Atelier, Bangladesh</span>
								</p>
							</div>
						</div>

						{/* Col 2: Shopping Detail */}
						<div className="lg:col-span-3 space-y-3">
							<p className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border/40 pb-2">
								SHOPPING DETAIL
							</p>
							<ul className="space-y-2 text-xs text-muted-foreground">
								<li>
									<NavigationLink href="/page/myinfinityreward" className="hover:text-foreground transition-colors">
										MY iNFINITY REWARD
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/size-chart" className="hover:text-foreground transition-colors">
										SIZE CHART
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/store-locator" className="hover:text-foreground transition-colors">
										STORE LOCATOR
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/reward-policy" className="hover:text-foreground transition-colors">
										Customer Reward Point Policy
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/clothing-care" className="hover:text-foreground transition-colors">
										CARE INSTRUCTIONS
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/gift-card" className="hover:text-foreground transition-colors">
										GIFT CARD
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/lookbook" className="hover:text-foreground transition-colors">
										LOOK BOOK
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/account/orders" className="hover:text-foreground transition-colors font-medium text-foreground">
										Track Order
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/shop?tag=sale" className="text-rose-600 hover:text-rose-700 font-semibold transition-colors">
										FESTIVE SALE - UP TO 50%
									</NavigationLink>
								</li>
							</ul>
						</div>

						{/* Col 3: Policies */}
						<div className="lg:col-span-3 space-y-3">
							<p className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border/40 pb-2">
								POLICIES
							</p>
							<ul className="space-y-2 text-xs text-muted-foreground">
								<li>
									<NavigationLink href="/page/delivery-return" className="hover:text-foreground transition-colors">
										DELIVERY, RETURN & CANCELLATION
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/billing-payments" className="hover:text-foreground transition-colors">
										BILLING & PAYMENTS
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/privacy-policy" className="hover:text-foreground transition-colors">
										PRIVACY POLICY
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/international-shipping" className="hover:text-foreground transition-colors">
										INTERNATIONAL DELIVERY & SHIPPING
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/terms" className="hover:text-foreground transition-colors">
										TERMS OF SERVICE
									</NavigationLink>
								</li>
							</ul>
						</div>

						{/* Col 4: Company */}
						<div className="lg:col-span-2 space-y-3">
							<p className="text-xs font-mono font-bold uppercase tracking-wider text-foreground border-b border-border/40 pb-2">
								COMPANY
							</p>
							<ul className="space-y-2 text-xs text-muted-foreground">
								<li>
									<NavigationLink href="/page/bsti-license" className="hover:text-foreground transition-colors">
										BSTI LICENSE
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/aboutus" className="hover:text-foreground transition-colors">
										OUR MASTER MINDS
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/brands" className="hover:text-foreground transition-colors">
										BRANDS
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/corporate" className="hover:text-foreground transition-colors">
										CORPORATE
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/career" className="hover:text-foreground transition-colors">
										CAREER
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/contact-info" className="hover:text-foreground transition-colors">
										CONTACT US
									</NavigationLink>
								</li>
								<li>
									<NavigationLink href="/page/dbid" className="hover:text-foreground transition-colors">
										DIGITAL BUSINESS IDENTITY (DBID)
									</NavigationLink>
								</li>
							</ul>
						</div>
					</div>

					{/* FOOTER Socials and Extras */}
					<div className="mt-14 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
						{/* Social Channels */}
						<div className="flex items-center gap-3">
							<span className="text-xs font-mono uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
								Follow Us:
							</span>
							<a
								href="https://www.facebook.com/infinitymegamall/"
								target="_blank"
								rel="noreferrer"
								className="size-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold"
								aria-label="Facebook"
							>
								f
							</a>
							<a
								href="https://www.instagram.com/infinity_mega_mall/"
								target="_blank"
								rel="noreferrer"
								className="size-8 rounded-full bg-[#f80c9f] text-white flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold"
								aria-label="Instagram"
							>
								ig
							</a>
							<a
								href="https://www.tiktok.com/@infinitymegamall.com"
								target="_blank"
								rel="noreferrer"
								className="size-8 rounded-full bg-[#000000] text-white flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold border border-white/20"
								aria-label="TikTok"
							>
								tt
							</a>
							<a
								href="https://x.com/infinitybd2016"
								target="_blank"
								rel="noreferrer"
								className="size-8 rounded-full bg-[#000000] text-white flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold"
								aria-label="X"
							>
								x
							</a>
							<a
								href="https://www.linkedin.com/company/infinity-mega-mall/"
								target="_blank"
								rel="noreferrer"
								className="size-8 rounded-full bg-[#189ce2] text-white flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold"
								aria-label="LinkedIn"
							>
								in
							</a>
							<a
								href="https://www.youtube.com/channel/UCbDmyxYD6r2eZ0przA72IaQ"
								target="_blank"
								rel="noreferrer"
								className="size-8 rounded-full bg-[#ef052f] text-white flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold"
								aria-label="YouTube"
							>
								yt
							</a>
						</div>

						{/* Copyright */}
						<div className="text-center text-xs text-muted-foreground">
							<p>Copyright &copy; {COPYRIGHT_YEAR} <span className="font-semibold text-foreground">iNFINITY Mega Mall / Suisuto Bangladesh</span>. All rights reserved.</p>
						</div>

						{/* Payment Badges */}
						<div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
							<span className="px-2 py-0.5 rounded border border-border/80 bg-background font-semibold text-rose-500">bKash</span>
							<span className="px-2 py-0.5 rounded border border-border/80 bg-background font-semibold text-orange-500">Nagad</span>
							<span className="px-2 py-0.5 rounded border border-border/80 bg-background font-semibold text-purple-500">Rocket</span>
							<span className="px-2 py-0.5 rounded border border-border/80 bg-background">Visa</span>
							<span className="px-2 py-0.5 rounded border border-border/80 bg-background">Mastercard</span>
							<span className="px-2 py-0.5 rounded border border-border/80 bg-background font-semibold text-emerald-600">COD</span>
						</div>
					</div>
				</div>
			</footer>
		);
	}

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
