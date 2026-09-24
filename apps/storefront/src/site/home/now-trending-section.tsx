import { Flame, ArrowRight } from "lucide-react";
import { ProductCard } from "@/features/products/components/product-card";
import type { ProductCardFragment } from "@/features/products/graphql";
import type { FragmentOf } from "@/platform/vendure/graphql";
import { Link } from "@/platform/tanstack/navigation";

export function NowTrendingSection({
	products = [],
	currencyCode = "BDT",
	title = "NOW TRENDING",
	subtitle = "Editorial picks, seasonal new arrivals, and popular handlooms capturing attention right now.",
}: {
	products?: Array<FragmentOf<typeof ProductCardFragment>>;
	currencyCode?: string;
	title?: string;
	subtitle?: string;
}) {
	// Display up to 8 products in trending grid
	const displayProducts = products.slice(0, 8);

	return (
		<section className="py-20 md:py-28 bg-secondary/10 border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
					<div className="space-y-2">
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-rose-600 dark:text-rose-400">
							<Flame className="size-3" />
							<span>Live Market Demand</span>
						</div>
						<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground">
							{title}
						</h2>
						<p className="text-xs md:text-sm text-muted-foreground font-sans max-w-xl">
							{subtitle}
						</p>
					</div>

					<Link
						href="/shop?sort=trending"
						className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors shrink-0"
					>
						<span>View Full Catalog</span>
						<ArrowRight className="size-3.5" />
					</Link>
				</div>

				{/* 4-column Product Grid */}
				{displayProducts.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
						{displayProducts.map((product, idx) => (
							<ProductCard
								key={`trending-${idx}`}
								product={product}
								currencyCode={currencyCode}
								layout="grid"
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={`trend-ph-${i}`}
								className="aspect-3/4 bg-secondary/20 rounded-lg flex items-center justify-center text-xs font-mono text-muted-foreground"
							>
								Trending Piece #{i}
							</div>
						))}
					</div>
				)}

				{/* Bottom CTA */}
				<div className="mt-14 flex justify-center">
					<Link
						href="/shop"
						className="inline-flex items-center gap-2.5 px-10 py-4 bg-foreground text-background hover:bg-foreground/90 text-xs font-mono font-semibold uppercase tracking-[0.25em] rounded-sm transition-all shadow-md hover:scale-105"
					>
						<span>Discover All New Arrivals</span>
						<ArrowRight className="size-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
