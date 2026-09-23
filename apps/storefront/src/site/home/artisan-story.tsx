import { ArrowRight, Sparkles, Feather, Heart } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";
import { Button } from "@/components/ui/button";

export function ArtisanStory() {
	return (
		<section
			id="artisan-heritage"
			className="py-20 md:py-32 bg-secondary/15 border-b border-border/40 relative overflow-hidden"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left: Brand Manifesto & Heritage Pillars */}
					<div className="lg:col-span-6 space-y-8">
						<div className="space-y-3">
							<div className="inline-flex items-center gap-2 px-3 py-1 border border-border bg-background text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
								<Sparkles className="size-3 text-amber-500" />
								<span>Heritage & Provenance</span>
							</div>

							<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1]">
								Generations of Master Weavers.{" "}
								<span className="font-serif italic font-normal text-muted-foreground block sm:inline">
									Direct From The Loom.
								</span>
							</h2>
						</div>

						<p className="text-sm md:text-base text-muted-foreground leading-relaxed font-sans max-w-xl">
							Suisuto was conceived to elevate and preserve the ancient textile traditions of South Asia. By connecting generational loom masters directly with discerning clientele worldwide, we ensure fair artisan equity while honoring century-old techniques.
						</p>

						{/* 2 Narrative Craft Cards */}
						<div className="grid sm:grid-cols-2 gap-4 pt-1">
							<div className="space-y-2 p-5 border border-border/80 bg-card">
								<div className="flex items-center gap-2 font-medium text-sm text-foreground">
									<Feather className="size-4 text-amber-500" />
									<span className="font-serif text-base font-semibold">Ancestral Weaves</span>
								</div>
								<p className="text-xs text-muted-foreground leading-relaxed font-sans">
									Certified Dhakai Muslin, Jamdani supplementary weft patterns, and pure gold tissue zari crafted on heritage pit looms.
								</p>
							</div>

							<div className="space-y-2 p-5 border border-border/80 bg-card">
								<div className="flex items-center gap-2 font-medium text-sm text-foreground">
									<Heart className="size-4 text-emerald-500" />
									<span className="font-serif text-base font-semibold">Direct Artisan Equity</span>
								</div>
								<p className="text-xs text-muted-foreground leading-relaxed font-sans">
									100% of pieces are commissioned with living wages paid directly to family-owned artisan cooperatives.
								</p>
							</div>
						</div>

						<div className="pt-2">
							<Button
								render={<Link href="/collections/atelier" />}
								nativeButton={false}
								size="lg"
								className="h-12 font-mono text-xs font-medium uppercase tracking-[0.25em] px-8 rounded-none bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2"
							>
								<span>Explore The Heritage Edit</span>
								<ArrowRight className="size-3.5" />
							</Button>
						</div>
					</div>

					{/* Right: Master Artisan Documentary Photo & Macro Loom Inset */}
					<div className="lg:col-span-6">
						<div className="relative border border-border/70 overflow-hidden bg-black group">
							<img
								src="/images/artisan-loom.jpg"
								alt="Master Weaver on Traditional Loom"
								className="w-full aspect-4/3 object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

							{/* Macro Craft Inset */}
							<div className="absolute top-4 right-4 hidden sm:block w-36 sm:w-44 aspect-square border border-white/20 shadow-2xl overflow-hidden bg-black group-hover:border-amber-400/50 transition-colors duration-500">
								<img
									src="/images/craft-loom.jpg"
									alt="Intricate Handloom Shuttle Craft"
									className="size-full object-cover transition-transform duration-700 hover:scale-110"
								/>
								<div className="absolute inset-x-0 bottom-0 bg-black/80 px-2 py-1 text-[8px] font-mono tracking-widest uppercase text-amber-300/90 text-center">
									Intricate Shuttle
								</div>
							</div>

							<div className="absolute bottom-6 left-6 right-6 p-6 bg-black/75 backdrop-blur-md border border-white/15 space-y-2">
								<span className="text-[9px] font-mono uppercase tracking-[0.25em] text-amber-400 block">
									Preserving Cultural Textiles
								</span>
								<p className="font-serif italic text-sm sm:text-base text-white/95 leading-snug">
									&ldquo;Each Jamdani motif is a visual poem composed thread by thread without pattern papers or automated machinery.&rdquo;
								</p>
								<span className="text-[10px] font-mono tracking-widest text-white/60 block pt-1">
									Demra & Narayanganj Master Loom Clusters
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
