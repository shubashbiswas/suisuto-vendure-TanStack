import { Link } from "@/platform/tanstack/navigation";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function ShopTheMoodSection({
	moodTitle = "ROYAL FESTIVE MIDNIGHT",
	moodSubtitle = "An ode to dusk ceremonies, opulent midnight indigos, and hand-loomed gold zari.",
	moodCategory = "Festive Panjabi & Jamdani",
	moodImageUrl = "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/Zz8bqMREyksoM6KdKTJuBF76AHrKEan329vW8gAr.jpg",
	ctaHref = "/shop?category=festive-mood",
}: {
	moodTitle?: string;
	moodSubtitle?: string;
	moodCategory?: string;
	moodImageUrl?: string;
	ctaHref?: string;
}) {
	const moodHighlights = [
		{
			title: "Sovereign Dhakai Jamdani Weft",
			desc: "Woven on non-mechanized bamboo pit-looms over 90 days.",
		},
		{
			title: "Midnight Indigo & Mineral Dyes",
			desc: "Eco-certified organic vegetable bath extraction for deep lustrous tones.",
		},
		{
			title: "Architectural Bandhgala Collar",
			desc: "Precision single-needle tailored collar lined with mulberry silk.",
		},
	];

	return (
		<section className="py-20 md:py-28 bg-neutral-950 text-white border-b border-white/10">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left: Mood Visual Showcase */}
					<div className="lg:col-span-6 relative">
						<div className="relative rounded-2xl overflow-hidden aspect-4/5 border border-white/15 shadow-2xl group">
							<img
								src={moodImageUrl}
								alt={moodTitle}
								className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
								loading="lazy"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

							{/* Floating Mood Badge */}
							<div className="absolute top-6 left-6 z-10">
								<span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300">
									Mood Spotlight: {moodCategory}
								</span>
							</div>

							<div className="absolute bottom-6 left-6 right-6 z-10">
								<p className="font-serif text-2xl sm:text-3xl font-light text-white">
									The Atelier Lookbook
								</p>
								<p className="text-xs text-neutral-300 font-sans mt-1">
									Complete coordinated evening capsule.
								</p>
							</div>
						</div>
					</div>

					{/* Right: Editorial Narrative & Mood Details */}
					<div className="lg:col-span-6 space-y-8">
						<div className="space-y-4">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400">
								<Sparkles className="size-3" />
								<span>Shop The Mood</span>
							</div>

							<h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
								{moodTitle}
							</h2>

							<p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
								{moodSubtitle}
							</p>
						</div>

						{/* Mood Features */}
						<div className="space-y-4 border-t border-white/10 pt-6">
							{moodHighlights.map((hl, i) => (
								<div key={`hl-${i}`} className="flex items-start gap-3.5">
									<div className="size-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
										<CheckCircle2 className="size-3.5 text-amber-400" />
									</div>
									<div>
										<h4 className="text-xs font-mono uppercase tracking-wider text-white font-medium">
											{hl.title}
										</h4>
										<p className="text-xs text-neutral-400 font-sans mt-0.5">
											{hl.desc}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* CTAs */}
						<div className="pt-4 flex flex-wrap items-center gap-4">
							<Link
								href={ctaHref}
								className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-neutral-200 text-xs font-mono font-semibold uppercase tracking-[0.25em] rounded-sm transition-all shadow-xl hover:translate-x-1"
							>
								<span>Shop The Complete Mood</span>
								<ArrowRight className="size-4" />
							</Link>

							<Link
								href="/shop?sort=newest"
								className="inline-flex items-center gap-2 px-6 py-4 border border-white/30 hover:border-white text-xs font-mono uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-colors"
							>
								<span>View Editorial Lookbook</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
