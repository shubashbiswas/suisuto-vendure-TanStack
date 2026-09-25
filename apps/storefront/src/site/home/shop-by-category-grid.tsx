import { ArrowUpRight } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/use-scroll-reveal";

export interface CategoryItem {
	name: string;
	banglaName?: string;
	tagline?: string;
	imageUrl?: string;
	href: string;
	itemCount?: string;
}

export function ShopByCategoryGrid({
	categories,
	collections,
	badge = "Curated Catalog",
	title = "SHOP BY COLLECTION",
	subtitle = "Explore distinct artisanal wardrobes and curated departments.",
}: {
	categories?: CategoryItem[];
	collections?: Array<{
		id: string;
		name: string;
		slug: string;
		featuredAsset?: { id?: string; preview?: string } | null;
	}>;
	badge?: string;
	title?: string;
	subtitle?: string;
}) {
	const validCategories: CategoryItem[] =
		Array.isArray(categories) && categories.length > 0
			? categories
			: Array.isArray(collections) && collections.length > 0
			? collections.map((col) => ({
					name: col.name,
					tagline: "Curated Archive",
					imageUrl: col.featuredAsset?.preview || "",
					href: `/collections/${col.slug}`,
			  }))
			: [];

	const titleRef = useScrollReveal<HTMLDivElement>();
	const gridRef = useStaggeredReveal<HTMLDivElement>();

	if (validCategories.length === 0) {
		return null;
	}

	return (
		<section className="py-20 md:py-28 bg-background border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div ref={titleRef} className="scroll-reveal text-center max-w-2xl mx-auto mb-14 space-y-2">
					<span className="text-[10px] font-mono font-semibold uppercase tracking-[0.3em] text-primary/80">
						{badge}
					</span>
					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground section-title-accent">
						{title}
					</h2>
					<p className="text-xs md:text-sm text-muted-foreground font-sans">
						{subtitle}
					</p>
				</div>

				{/* 3x3 Responsive Grid with staggered reveal */}
				<div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{validCategories.map((cat, idx) => (
						<Link
							key={`cat-${cat.href}-${idx}`}
							href={cat.href}
							className="scroll-reveal-scale group relative h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-border/60 bg-neutral-900 block"
						>
							{cat.imageUrl ? (
								<img
									src={cat.imageUrl}
									alt={cat.name}
									className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-85 group-hover:opacity-95"
									loading="lazy"
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-center">
									<div className="size-20 rounded-full border border-white/10 flex items-center justify-center font-serif text-2xl text-amber-300/40">
										{cat.name.slice(0, 2).toUpperCase()}
									</div>
								</div>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 group-hover:from-black/95 transition-colors" />

							{/* Top badge */}
							{cat.itemCount && (
								<div className="absolute top-4 left-4 z-10">
									<span className="px-2.5 py-1 rounded-sm bg-black/60 backdrop-blur-md text-[9.5px] font-mono uppercase tracking-widest text-neutral-300 border border-white/10">
										{cat.itemCount}
									</span>
								</div>
							)}

							{/* Bottom Info */}
							<div className="absolute inset-x-0 bottom-0 p-6 z-10 flex items-end justify-between">
								<div className="space-y-1">
									{cat.tagline && (
										<p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400">
											{cat.tagline}
										</p>
									)}
									<h3 className="font-serif text-xl sm:text-2xl text-white font-normal tracking-tight group-hover:text-amber-200 transition-colors">
										{cat.name}
									</h3>
									{cat.banglaName && (
										<p className="text-xs text-neutral-400 font-sans">
											{cat.banglaName}
										</p>
									)}
								</div>

								<div className="size-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300">
									<ArrowUpRight className="size-4" />
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
