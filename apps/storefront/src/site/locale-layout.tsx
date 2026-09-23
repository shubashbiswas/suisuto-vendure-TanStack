import { getRouteApi } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { CartDrawerProvider } from "@/features/cart/context/cart-drawer-context";
import { WishlistProvider } from "@/features/wishlist/context/wishlist-context";
import { Footer } from "@/site/footer";
import { Navbar } from "@/site/navigation/navbar";
import { GeoSuggestionBanner } from "@/features/market/geo-suggestion-banner";
import { ThemeProvider } from "@/site/providers/theme-provider";

const rootRoute = getRouteApi("__root__");

export function LocaleLayout({ children }: { children: ReactNode }) {
	const shell = rootRoute.useLoaderData();
	return (
		<ThemeProvider>
			<CartDrawerProvider>
				<WishlistProvider>
					<Navbar
					collections={shell?.collections || []}
					availableCurrencyCodes={shell?.availableCurrencyCodes || []}
					activeCurrencyCode={shell?.activeCurrencyCode || "USD"}
					activeRegion={shell?.activeRegion}
					availableRegions={shell?.availableRegions || []}
					personalized={shell?.personalized}
				/>
				<GeoSuggestionBanner
					activeRegion={shell?.activeRegion}
					availableRegions={shell?.availableRegions || []}
				/>
				{children}
				<Footer
					collections={shell?.collections || []}
					activeRegion={shell?.activeRegion}
					activeCurrencyCode={shell?.activeCurrencyCode || "USD"}
					availableRegions={shell?.availableRegions || []}
				/>
				<CartDrawer />
				<Toaster />
				</WishlistProvider>
			</CartDrawerProvider>
		</ThemeProvider>
	);
}
