import { useRef } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { ProductCard } from "@/features/products/components/product-card";
import type { ProductCardFragment } from "@/features/products/graphql";
import type { FragmentOf } from "@/platform/vendure/graphql";
import { Link } from "@/platform/tanstack/navigation";

export function BestsellingSlidesSection({
	products = [],
	currencyCode = "BDT",
	title = "BEST-SELLING PIECES",
	subtitle = "Top-rated panjabis, festive attires, and master weaves ordered by customers nationwide.",
}: {
	products?: Array<FragmentOf<typeof ProductCardFragment>>;
	currencyCode?: string;
	title?: string;
	subtitle?: string;
}) {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollContainerRef.current) {
			const scrollAmount = direction === "left" ? -420 : 420;
			scrollContainerRef.current.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="py-20 md:py-28 bg-background border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
					<div className="space-y-2">
						<div className="inline-flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-primary/80">
							<TrendingUp className="size-3 text-emerald-500" />
							<span>Most Coveted Across Bangladesh</span>
						</div>
						<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground">
							{title}
						</h2>
						<p className="text-xs md:text-sm text-muted-foreground font-sans max-w-xl">
							{subtitle}
						</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => scroll("left")}
							aria-label="Previous products"
							className="size-11 rounded-full border border-border/80 hover:border-foreground bg-background hover:bg-secondary/40 flex items-center justify-center transition-colors"
						>
							<ChevronLeft className="size-5" />
						</button>
						<button
							type="button"
							onClick={() => scroll("right")}
							aria-label="Next products"
							className="size-11 rounded-full border border-border/80 hover:border-foreground bg-background hover:bg-secondary/40 flex items-center justify-center transition-colors"
						>
							<ChevronRight className="size-5" />
						</button>
						<Link
							href="/shop?sort=bestselling"
							className="hidden sm:inline-flex items-center px-5 py-2.5 text-xs font-mono uppercase tracking-[0.2em] border border-border/80 hover:border-foreground hover:bg-foreground hover:text-background transition-all"
						>
							View All
						</Link>
					</div>
				</div>

				{/* Horizontal Product Slides Carousel */}
				<div
					ref={scrollContainerRef}
					className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{products.length > 0 ? (
						products.map((product, idx) => (
							<div
								key={`bestseller-${idx}`}
								className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] max-w-[360px] shrink-0 snap-start"
							>
								<ProductCard
									product={product}
									currencyCode={currencyCode}
									layout="carousel"
								/>
							</div>
						))
					) : (
						/* Fallback visual preview items if catalog empty */
						[1, 2, 3, 4, 5, 6].map((idx) => (
							<div
								key={`placeholder-${idx}`}
								className="min-w-[280px] sm:min-w-[320px] shrink-0 p-4 border border-border/60 bg-secondary/10 rounded-lg space-y-3"
							>
								<div className="aspect-3/4 bg-secondary/30 rounded flex items-center justify-center text-muted-foreground text-xs font-mono">
									Atelier Piece #{idx}
								</div>
								<div className="h-4 bg-secondary/40 rounded w-3/4" />
								<div className="h-4 bg-secondary/20 rounded w-1/3" />
							</div>
						))
					)}
				</div>
			</div>
		</section>
	);
}
