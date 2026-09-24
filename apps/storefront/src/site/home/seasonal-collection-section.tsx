import { Link } from "@/platform/tanstack/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export function SeasonalCollectionSection({
	title = "Festive Seasonal Collection 2026",
	subtitle = "A royal celebration of ancestral Bengali looms, Dhakai Jamdani supplementary wefts, and bespoke festive panjabis.",
	bannerUrl = "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/R4KUiGCjERrYo2b0TZaclu4BMxqqAEBr6rh0H99V.png",
	ctaHref = "/shop?category=seasonal",
	ctaText = "Shop Seasonal Collection",
}: {
	title?: string;
	subtitle?: string;
	bannerUrl?: string;
	ctaHref?: string;
	ctaText?: string;
}) {
	return (
		<section className="py-16 md:py-24 bg-secondary/20 border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-border/60 shadow-xl">
					<div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[520px]">
						{/* Text & Feature Column */}
						<div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10 bg-radial-[at_0%_0%] from-neutral-900/90 to-neutral-950">
							<div className="space-y-4">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400">
									<Sparkles className="size-3" />
									<span>Limited Seasonal Edition</span>
								</div>

								<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
									{title}
								</h2>

								<p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed max-w-md">
									{subtitle}
								</p>
							</div>

							<div className="pt-8 space-y-6">
								{/* Micro-assurances */}
								<div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
									<div className="flex items-center gap-2 text-neutral-300">
										<ShieldCheck className="size-4 text-emerald-400 shrink-0" />
										<span className="text-[10px] font-mono uppercase tracking-wider">Certified Loom</span>
									</div>
									<div className="flex items-center gap-2 text-neutral-300">
										<Truck className="size-4 text-sky-400 shrink-0" />
										<span className="text-[10px] font-mono uppercase tracking-wider">Nationwide BD</span>
									</div>
									<div className="flex items-center gap-2 text-neutral-300">
										<RefreshCw className="size-4 text-amber-400 shrink-0" />
										<span className="text-[10px] font-mono uppercase tracking-wider">Easy Exchange</span>
									</div>
								</div>

								<div>
									<Link
										href={ctaHref}
										className="inline-flex items-center gap-3 px-8 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-mono font-semibold uppercase tracking-[0.25em] rounded-md transition-all shadow-lg hover:translate-x-1"
									>
										<span>{ctaText}</span>
										<ArrowRight className="size-3.5" />
									</Link>
								</div>
							</div>
						</div>

						{/* Visual Banner Column — parallax scroll */}
						<div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full overflow-hidden parallax-scroll-container">
							<img
								src={bannerUrl}
								alt="Seasonal Collection"
								className="w-full h-[115%] top-[-7.5%] relative object-cover object-center parallax-media"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent lg:hidden" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
