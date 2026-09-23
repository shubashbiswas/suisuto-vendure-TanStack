import { ArrowRight, Sparkles, Award, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/platform/tanstack/navigation";

import { getOptimizedAssetUrl, getAssetSrcSet } from "@/platform/vendure/asset";

export interface HeroSectionProps {
	heroImageUrl?: string;
	heroHeadline?: string;
	heroSubHeadline?: string;
	heroCtaLabel?: string;
	heroCtaHref?: string;
	heroTag?: string;
}

export function HeroSection({
	heroImageUrl,
	heroHeadline,
	heroSubHeadline,
	heroCtaLabel,
	heroCtaHref,
	heroTag,
}: HeroSectionProps = {}) {
	const imageUrl = heroImageUrl || "/images/hero-campaign.jpg";
	const tag = heroTag || "Autumn / Winter 2026 Campaign";
	const subHeadline =
		heroSubHeadline ||
		"Generational handloom textiles reimagined through contemporary tailoring. Individually commissioned from master artisans with certified provenance.";
	const ctaLabel = heroCtaLabel || "Explore The Runway";
	const ctaHref = heroCtaHref || "/collections/atelier";

	return (
		<section className="relative min-h-[85vh] flex flex-col justify-between bg-black text-white overflow-hidden">
			{/* High-fashion campaign hero backdrop with dramatic lighting */}
			<div className="absolute inset-0 z-0">
				<img
					src={getOptimizedAssetUrl(imageUrl, { width: 1920, format: "webp" })}
					srcSet={getAssetSrcSet(imageUrl) || undefined}
					sizes="100vw"
					alt={heroHeadline || "Suisuto Haute Couture Campaign"}
					className="w-full h-full object-cover object-top opacity-75 sm:opacity-85 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
					loading="eager"
					fetchPriority="high"
				/>
				{/* Editorial dark gradient overlay for cinematic contrast */}
				<div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/30" />
				<div className="absolute inset-0 bg-radial-[at_20%_40%] from-transparent via-black/20 to-black/80" />
			</div>

			{/* Top Spacer */}
			<div className="relative z-10 pt-10" />

			{/* Floating Editorial Headline & CTAs */}
			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="max-w-3xl space-y-6">
					{/* Capsule Tag */}
					<div className="inline-flex items-center gap-2 px-3.5 py-1 border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-mono tracking-[0.3em] uppercase text-white/90">
						<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
						<span>{tag}</span>
						<Sparkles className="size-3 text-amber-400 ml-1" />
					</div>

					{/* Grand Serif Editorial Headline */}
					<h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-white leading-[1.05]">
						{heroHeadline ? (
							heroHeadline
						) : (
							<>
								Where Ancient Threads Meet{" "}
								<span className="block font-serif italic font-normal text-white/80">
									Modern Architecture.
								</span>
							</>
						)}
					</h1>

					{/* Sub-narrative */}
					<p className="text-sm sm:text-base md:text-lg text-white/75 max-w-xl font-sans leading-relaxed tracking-wide">
						{subHeadline}
					</p>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
						<Button
							render={<Link href={ctaHref} />}
							nativeButton={false}
							size="lg"
							className="h-14 px-8 text-xs font-mono font-medium tracking-[0.25em] uppercase rounded-none bg-white text-black hover:bg-white/90 hover:text-black transition-all flex items-center justify-center gap-3"
						>
							<span>{ctaLabel}</span>
							<ArrowRight className="size-3.5" />
						</Button>

						<Button
							render={<a href="#artisan-heritage" />}
							nativeButton={false}
							variant="outline"
							size="lg"
							className="h-14 px-8 text-xs font-mono font-medium tracking-[0.25em] uppercase rounded-none border-white/40 text-white hover:bg-white/10 hover:border-white transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
						>
							<span>The Master Weavers</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Bottom Luxury Value Bar */}
			<div className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-md py-4">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left text-xs text-white/70">
						<div className="flex items-center justify-center sm:justify-start gap-2.5">
							<Award className="size-4 text-amber-400 shrink-0" />
							<span className="font-mono tracking-wider uppercase text-[11px]">100% Certified Master Weaves</span>
						</div>
						<div className="flex items-center justify-center sm:justify-start gap-2.5">
							<Truck className="size-4 text-amber-400 shrink-0" />
							<span className="font-mono tracking-wider uppercase text-[11px]">Climate-Neutral Express Dispatch</span>
						</div>
						<div className="flex items-center justify-center sm:justify-start gap-2.5">
							<ShieldCheck className="size-4 text-amber-400 shrink-0" />
							<span className="font-mono tracking-wider uppercase text-[11px]">Numbered Heritage Certificate</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
