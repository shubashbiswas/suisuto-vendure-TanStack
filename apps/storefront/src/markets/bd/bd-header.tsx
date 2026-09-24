import { Await } from "@tanstack/react-router";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CartIcon } from "@/site/navigation/navbar/cart-icon";
import { WishlistIcon } from "@/site/navigation/navbar/wishlist-icon";
import { MobileNav } from "@/site/navigation/navbar/mobile-nav";
import { NavbarUser } from "@/site/navigation/navbar/navbar-user";
import { NavigationLink } from "@/site/navigation/navigation-link";
import { SearchInput } from "@/site/navigation/search-input";
import { NavbarUserSkeleton } from "@/site/navigation/skeletons/navbar-user-skeleton";
import { SearchInputSkeleton } from "@/site/navigation/skeletons/search-input-skeleton";
import { BdTopRibbon } from "./navigation/bd-top-ribbon";
import { BdCategoryNav } from "./navigation/bd-category-nav";
import type { MarketHeaderProps } from "../types";

export function BdHeader({
	collections,
	availableCurrencyCodes,
	activeCurrencyCode,
	activeRegion,
	availableRegions,
	personalized,
	campaignAnnouncement,
}: MarketHeaderProps) {
	return (
		<header className="sticky top-0 left-0 right-0 z-50 transition-all shadow-xs">
			{/* Top Ribbon Menu: About US | Contact US -- Announcements -- Track order | call Hotline */}
			<BdTopRibbon
				activeRegion={activeRegion}
				availableRegions={availableRegions}
				availableCurrencyCodes={availableCurrencyCodes}
				activeCurrencyCode={activeCurrencyCode}
				campaignAnnouncement={campaignAnnouncement}
			/>

			{/* Middle Header: Search, Logo, User / Wishlist / Cart */}
			<div className="bg-background/95 backdrop-blur-xl border-b border-border/50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-18 sm:h-20 gap-4">
						{/* Left: Mobile Nav & Desktop Search */}
						<div className="flex-1 flex items-center justify-start gap-3">
							<Suspense>
								<MobileNav
									collections={collections}
									availableCurrencyCodes={availableCurrencyCodes}
									activeCurrencyCode={activeCurrencyCode}
									activeRegion={activeRegion}
									availableRegions={availableRegions}
									personalized={personalized}
								/>
							</Suspense>

							<div className="hidden md:flex max-w-xs lg:max-w-sm w-full">
								<Suspense fallback={<SearchInputSkeleton />}>
									<SearchInput />
								</Suspense>
							</div>
						</div>

						{/* Center: Brand Logo */}
						<div className="flex items-center justify-center shrink-0 py-1">
							<NavigationLink
								href="/bd"
								className="group flex flex-col items-center justify-center select-none text-center"
							>
								<div className="relative size-8 sm:size-9 mb-0.5 transition-transform duration-500 group-hover:scale-105">
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
								<span className="font-serif text-xl sm:text-2xl lg:text-2xl font-light tracking-[0.25em] text-foreground transition-all duration-500 group-hover:tracking-[0.28em] leading-tight">
									SUISUTO
								</span>
								<span className="text-[7px] sm:text-[7.5px] font-mono tracking-[0.45em] text-muted-foreground uppercase mt-0.5">
									Bangladesh Atelier
								</span>
							</NavigationLink>
						</div>

						{/* Right: Account, Wishlist & Cart */}
						<div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
							<div className="hidden sm:flex">
								<Await promise={personalized} fallback={<NavbarUserSkeleton />}>
									{(data) => <NavbarUser firstName={data.customerFirstName} />}
								</Await>
							</div>

							<WishlistIcon />

							<Await
								promise={personalized}
								fallback={<Skeleton className="h-9 w-16 rounded-none" />}
							>
								{(data) => <CartIcon cartItemCount={data.cartItemCount} />}
							</Await>
						</div>
					</div>
				</div>
			</div>

			{/* Category Navigation Bar (Megamenu) */}
			<BdCategoryNav />
		</header>
	);
}
