import { useEffect, useRef, useCallback } from "react";

/**
 * Lightweight IntersectionObserver hook for scroll-triggered reveals.
 * Adds `.is-visible` class when element enters viewport.
 * Falls back gracefully when IntersectionObserver is unavailable.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
	options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
) {
	const ref = useRef<T>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Respect prefers-reduced-motion
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) {
			el.classList.add("is-visible");
			return;
		}

		if (!("IntersectionObserver" in window)) {
			el.classList.add("is-visible");
			return;
		}

		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			}
		}, options);

		observer.observe(el);

		return () => observer.disconnect();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps -- options are stable defaults

	return ref;
}

/**
 * Hook variant that observes multiple children of a container,
 * applying staggered `is-visible` with CSS custom property `--item-index`.
 */
export function useStaggeredReveal<T extends HTMLElement = HTMLElement>(
	childSelector = ":scope > *",
	options: IntersectionObserverInit = { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
) {
	const containerRef = useRef<T>(null);

	const observe = useCallback(() => {
		const container = containerRef.current;
		if (!container) return undefined;

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const children = container.querySelectorAll(childSelector);

		children.forEach((child, index) => {
			const el = child as HTMLElement;
			el.style.setProperty("--item-index", String(index));
			el.style.transitionDelay = `${index * 60}ms`;

			if (prefersReducedMotion) {
				el.classList.add("is-visible");
			}
		});

		if (prefersReducedMotion || !("IntersectionObserver" in window)) {
			children.forEach((child) => child.classList.add("is-visible"));
			return undefined;
		}

		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			}
		}, options);

		children.forEach((child) => observer.observe(child));

		return () => observer.disconnect();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps -- childSelector and options are stable defaults

	useEffect(() => {
		// Small delay to ensure DOM has rendered children
		const raf = requestAnimationFrame(() => observe());
		return () => cancelAnimationFrame(raf);
	}, [observe]);

	return containerRef;
}
