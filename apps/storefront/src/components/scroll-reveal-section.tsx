"use client";

import { type ReactNode, useRef, useEffect } from "react";

/**
 * Wrapper component that triggers a scroll-reveal entrance animation
 * when the wrapped section scrolls into the viewport.
 * Uses IntersectionObserver for efficient, off-main-thread detection.
 * Respects `prefers-reduced-motion: reduce`.
 */
export function ScrollRevealSection({
	children,
	className = "",
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	/** Optional delay in ms before the reveal triggers */
	delay?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Respect prefers-reduced-motion
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (prefersReducedMotion) {
			el.style.opacity = "1";
			el.style.transform = "none";
			return;
		}

		// Set initial hidden state
		el.style.opacity = "0";
		el.style.transform = "translateY(28px)";
		el.style.willChange = "opacity, transform";
		el.style.transition = `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

		if (!("IntersectionObserver" in window)) {
			el.style.opacity = "1";
			el.style.transform = "none";
			el.style.willChange = "auto";
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const target = entry.target as HTMLElement;
						target.style.opacity = "1";
						target.style.transform = "translateY(0)";
						// Clear will-change after transition completes to free GPU memory
						setTimeout(() => {
							if (target) target.style.willChange = "auto";
						}, 800 + delay);
						observer.unobserve(target);
					}
				}
			},
			{ threshold: 0.02, rootMargin: "0px 0px -30px 0px" },
		);

		observer.observe(el);

		return () => observer.disconnect();
	}, [delay]);

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}
