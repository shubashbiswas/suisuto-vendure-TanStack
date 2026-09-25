import { useState, useEffect, useRef } from "react";

export interface HeaderScrollOptions {
	/** Scroll threshold (in px) past which the header enters compact mode. Default: 40 */
	compactThreshold?: number;
	/** Scroll threshold (in px) past which the header can hide on scroll down. Default: 100 */
	hideThreshold?: number;
	/** Minimum scroll delta (in px) required to toggle visibility. Default: 8 */
	deltaThreshold?: number;
}

export interface HeaderScrollState {
	/** Whether the page has scrolled past compactThreshold */
	isScrolled: boolean;
	/** Whether the header is currently visible (slides down vs hides up) */
	isVisible: boolean;
	/** Current scroll direction */
	scrollDirection: "up" | "down";
	/** Current window scroll Y */
	scrollY: number;
}

/**
 * High-performance scroll hook for modern luxury storefront headers.
 * - Enters compact mode (collapsing top utility/marquee/megamenu) when scrolling past `compactThreshold`.
 * - Smoothly hides the header when scrolling DOWN past `hideThreshold`.
 * - Instantly reveals the compact header when scrolling UP (providing quick access to bag/search).
 * - Restores full grand header when scrolled all the way back to the top.
 */
export function useHeaderScroll(options: HeaderScrollOptions = {}): HeaderScrollState {
	const {
		compactThreshold = 40,
		hideThreshold = 100,
		deltaThreshold = 8,
	} = options;

	const [state, setState] = useState<HeaderScrollState>({
		isScrolled: false,
		isVisible: true,
		scrollDirection: "up",
		scrollY: 0,
	});

	const lastScrollYRef = useRef(0);
	const lastStateRef = useRef(state);
	lastStateRef.current = state;

	useEffect(() => {
		if (typeof window === "undefined") return;

		let rafId: number | null = null;

		const handleScroll = () => {
			if (rafId !== null) return;

			rafId = window.requestAnimationFrame(() => {
				rafId = null;

				const currentScrollY = Math.max(0, window.scrollY);
				const prevScrollY = lastScrollYRef.current;
				const delta = currentScrollY - prevScrollY;

				// Determine whether compact mode is active
				const isScrolled = currentScrollY > compactThreshold;

				let isVisible = lastStateRef.current.isVisible;
				let scrollDirection = lastStateRef.current.scrollDirection;

				// At or near top: always fully visible
				if (currentScrollY <= compactThreshold) {
					isVisible = true;
					scrollDirection = "up";
				} else if (Math.abs(delta) >= deltaThreshold) {
					if (delta > 0 && currentScrollY > hideThreshold) {
						// Scrolling DOWN: hide header to maximize screen real estate
						isVisible = false;
						scrollDirection = "down";
					} else if (delta < 0) {
						// Scrolling UP: reveal compact header for instant interaction
						isVisible = true;
						scrollDirection = "up";
					}
				}

				// Only trigger React re-render if meaningful state has changed
				if (
					lastStateRef.current.isScrolled !== isScrolled ||
					lastStateRef.current.isVisible !== isVisible ||
					lastStateRef.current.scrollDirection !== scrollDirection
				) {
					setState({
						isScrolled,
						isVisible,
						scrollDirection,
						scrollY: currentScrollY,
					});
				}

				lastScrollYRef.current = currentScrollY;
			});
		};

		// Initial check
		handleScroll();

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafId !== null) {
				window.cancelAnimationFrame(rafId);
			}
		};
	}, [compactThreshold, hideThreshold, deltaThreshold]);

	return state;
}
