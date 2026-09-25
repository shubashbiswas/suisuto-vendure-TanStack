import { Await } from "@tanstack/react-router";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CartIcon } from "@/site/navigation/navbar/cart-icon";
import { WishlistIcon } from "@/site/navigation/navbar/wishlist-icon";
import { MobileNav } from "@/site/navigation/navbar/mobile-nav";
import { NavbarCollections } from "@/site/navigation/navbar/navbar-collections";
import { NavbarUser } from "@/site/navigation/navbar/navbar-user";
import { NavigationLink } from "@/site/navigation/navigation-link";
import { SearchInput } from "@/site/navigation/search-input";
import { NavbarUserSkeleton } from "@/site/navigation/skeletons/navbar-user-skeleton";
import { SearchInputSkeleton } from "@/site/navigation/skeletons/search-input-skeleton";
import { AnnouncementMarquee } from "@/site/navigation/announcement-marquee";
import { LuxuryTopUtility } from "@/site/navigation/navbar/luxury-top-utility";
import { GlobalCategoryNav } from "./navigation/global-category-nav";
import { useHeaderScroll } from "@/hooks/use-header-scroll";
import { cn } from "@/lib/utils";
import type { MarketHeaderProps } from "../types";

export function GlobalHeader({
	collections,
	availableCurrencyCodes,
	activeCurrencyCode,
	activeRegion,
	availableRegions,
	personalized,
	campaignAnnouncement,
}: MarketHeaderProps) {
	const { isScrolled, isVisible } = useHeaderScroll();

	return (
		<header
			className={cn(
				"sticky top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
				isVisible ? "translate-y-0" : "-translate-y-full",
				isScrolled ? "shadow-md" : "shadow-xs"
			)}
		>
			{/* Tier 1: Micro Utility Bar (Regional market, currency, dark mode & concierge) */}
			<div
				className={cn(
					"transition-all duration-300 ease-in-out overflow-hidden origin-top",
					isScrolled ? "max-h-0 opacity-0 pointer-events-none" : "max-h-12 opacity-100"
				)}
			>
				<LuxuryTopUtility
					activeRegion={activeRegion}
					availableRegions={availableRegions}
					availableCurrencyCodes={availableCurrencyCodes}
					activeCurrencyCode={activeCurrencyCode}
				/>
			</div>

			{/* Tier 2: Moving Editorial Marquee */}
			<div
				className={cn(
					"transition-all duration-300 ease-in-out overflow-hidden origin-top",
					isScrolled ? "max-h-0 opacity-0 pointer-events-none" : "max-h-12 opacity-100"
				)}
			>
				<AnnouncementMarquee campaignAnnouncement={campaignAnnouncement} />
			</div>

			{/* Tier 3: Main Architectural Haute Couture Header */}
			<div className="bg-background/90 backdrop-blur-xl border-b border-border/50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div
						className={cn(
							"flex items-center justify-between transition-all duration-300 ease-in-out",
							isScrolled ? "h-14 sm:h-16" : "h-18 sm:h-20"
						)}
					>
						{/* Left: Mobile Trigger & Desktop Navigation Menu */}
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

							<nav className="hidden lg:flex items-center">
								<Suspense>
									<NavbarCollections collections={collections} />
								</Suspense>
							</nav>
						</div>

						{/* Center: Iconic Haute Couture Brand Logo */}
						<div className="flex items-center justify-center shrink-0 py-1">
							<NavigationLink
								href="/"
								className="group flex flex-col items-center justify-center select-none text-center"
							>
								<div
									className={cn(
										"relative transition-all duration-300 group-hover:scale-105",
										isScrolled ? "size-6 sm:size-7 mb-0" : "size-8 sm:size-9 mb-0.5"
									)}
								>
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
								<span
									className={cn(
										"font-serif font-light text-foreground transition-all duration-300 group-hover:tracking-[0.28em] leading-tight",
										isScrolled
											? "text-lg sm:text-xl tracking-[0.2em]"
											: "text-xl sm:text-2xl lg:text-2xl tracking-[0.25em]"
									)}
								>
									SUISUTO
								</span>
								<span
									className={cn(
										"font-mono tracking-[0.45em] text-muted-foreground uppercase transition-all duration-300",
										isScrolled
											? "text-[6px] sm:text-[6.5px] mt-0 hidden sm:inline-block"
											: "text-[7px] sm:text-[7.5px] mt-0.5"
									)}
								>
									Atelier d'Artisan
								</span>
							</NavigationLink>
						</div>

						{/* Right: Search, Client Account & Shopping Bag */}
						<div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
							<div className="hidden md:flex">
								<Suspense fallback={<SearchInputSkeleton />}>
									<SearchInput />
								</Suspense>
							</div>

							<div className="hidden sm:flex">
								{personalized ? (
									<Await promise={personalized} fallback={<NavbarUserSkeleton />}>
										{(data) => <NavbarUser firstName={data.customerFirstName} />}
									</Await>
								) : (
									<NavbarUserSkeleton />
								)}
							</div>

							<WishlistIcon />

							{personalized ? (
								<Await
									promise={personalized}
									fallback={<Skeleton className="h-9 w-16 rounded-none" />}
								>
									{(data) => <CartIcon cartItemCount={data.cartItemCount} />}
								</Await>
							) : (
								<CartIcon cartItemCount={0} />
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Category Navigation Bar (Haute Couture Megamenu) */}
			<div
				className={cn(
					"transition-all duration-300 ease-in-out origin-top",
					isScrolled
						? "max-h-0 opacity-0 overflow-hidden pointer-events-none"
						: "max-h-16 opacity-100 overflow-visible"
				)}
			>
				<GlobalCategoryNav />
			</div>
		</header>
	);
}
