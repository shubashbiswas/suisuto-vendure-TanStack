import {
	Link as RouterLink,
	useNavigate,
	useRouterState,
	useRouter as useTanStackRouter,
} from "@tanstack/react-router";
import { type ComponentProps, useMemo } from "react";

export type LocalizedLinkProps = Omit<ComponentProps<"a">, "href"> & {
	href?: string;
	to?: string;
	search?: any;
	params?: any;
	hash?: string;
	state?: any;
	mask?: any;
	locale?: string;
	activeProps?: any;
	inactiveProps?: any;
	activeOptions?: any;
	resetScroll?: boolean;
};

export function useActiveRegion(): string | null {
	const pathname = usePathname();
	if (!pathname) return null;
	const first = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
	// Check for known 2-letter ISO market codes (e.g. 'bd', 'in', etc.)
	if (first && first.length === 2 && /^[a-z]{2}$/.test(first)) {
		return first;
	}
	return null;
}

export function resolveRegionalHref(
	href: string,
	activeRegion?: string | null,
): string {
	if (!activeRegion || !href) return href;
	if (
		href.startsWith("http://") ||
		href.startsWith("https://") ||
		href.startsWith("//") ||
		href.startsWith("#") ||
		href.startsWith(".") ||
		href === "." ||
		href.startsWith("/api/") ||
		href.startsWith("/_")
	) {
		return href;
	}

	const clean = href.startsWith("/") ? href : `/${href}`;
	const segments = clean.split("/").filter(Boolean);
	if (
		segments.length > 0 &&
		(segments[0].toLowerCase() === activeRegion.toLowerCase() ||
			(segments[0].length === 2 && /^[a-z]{2}$/.test(segments[0])))
	) {
		return clean;
	}

	if (clean === "/") {
		return `/${activeRegion}`;
	}

	return `/${activeRegion}${clean}`;
}

export function Link({ href, to, locale: _locale, ...props }: LocalizedLinkProps) {
	const activeRegion = useActiveRegion();
	const rawTarget = href || to || "/";
	const targetHref = resolveRegionalHref(rawTarget, activeRegion);
	return <RouterLink to={targetHref as any} {...(props as any)} />;
}

export function usePathname() {
	return useRouterState({ select: (state) => state.location.pathname });
}

export function useSearchParams() {
	const search = useRouterState({
		select: (state) => state.location.searchStr,
	});
	return useMemo(() => new URLSearchParams(search), [search]);
}

export function useRouter() {
	const navigate = useNavigate();
	const router = useTanStackRouter();
	const activeRegion = useActiveRegion();
	return {
		push: (href: string, options?: { scroll?: boolean }) => {
			const targetHref = resolveRegionalHref(href, activeRegion);
			return navigate({ href: targetHref, resetScroll: options?.scroll });
		},
		replace: (
			href: string,
			options?: { locale?: string; scroll?: boolean },
		) => {
			if (options?.locale) {
				return import("@/paraglide/runtime.js").then(({ setLocale }) =>
					setLocale(options.locale as "en" | "de"),
				);
			}
			const targetHref = resolveRegionalHref(href, activeRegion);
			return navigate({ href: targetHref, replace: true });
		},
		refresh: () => router.invalidate(),
		invalidate: () => router.invalidate(),
	};
}

export function useSelectedLayoutSegment() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);
	if (
		segments.length > 0 &&
		segments[0].length === 2 &&
		/^[a-z]{2}$/.test(segments[0])
	) {
		return segments[1] ?? null;
	}
	return segments[0] ?? null;
}
