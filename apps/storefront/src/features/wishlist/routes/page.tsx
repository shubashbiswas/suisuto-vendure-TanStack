import { Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";
import { Button } from "@/components/ui/button";
import { Price } from "@/features/pricing/price";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import { getProductFallbackImage } from "@/features/products/product-fallback";

export default function WishlistPage() {
	const { items, removeItem, clearWishlist, totalCount } = useWishlist();

	return (
		<div className="min-h-[70vh] bg-background">
			{/* Editorial Header */}
			<section className="py-12 md:py-20 border-b border-border/40 bg-secondary/10">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl space-y-3">
						<div className="inline-flex items-center gap-2 px-3 py-1 border border-border/80 bg-background text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
							<Heart className="size-3 text-rose-500 fill-rose-500" />
							<span>Private Archive</span>
						</div>
						<h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
							The Atelier Wishlist
						</h1>
						<p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
							Personal curation of handcrafted weaves and architectural silhouettes reserved for your private acquisition.
						</p>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
				{totalCount === 0 ? (
					/* Empty State */
					<div className="max-w-lg mx-auto text-center py-16 space-y-6">
						<div className="size-16 mx-auto rounded-full bg-secondary/40 border border-border/60 flex items-center justify-center">
							<Heart className="size-7 text-muted-foreground stroke-[1.25]" />
						</div>
						<div className="space-y-2">
							<h2 className="font-serif text-2xl font-light text-foreground">
								Your Private Curation is Empty
							</h2>
							<p className="text-xs text-muted-foreground leading-relaxed font-sans max-w-sm mx-auto">
								You have not saved any pieces to your wishlist yet. Explore our certified master handloom creations and save your favorites.
							</p>
						</div>
						<div className="pt-2">
							<Button
								render={<Link href="/shop" />}
								nativeButton={false}
								size="lg"
								className="h-12 px-8 text-xs font-mono font-medium tracking-[0.25em] uppercase rounded-none bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2 mx-auto"
							>
								<span>Explore The Catalog</span>
								<ArrowRight className="size-3.5" />
							</Button>
						</div>
					</div>
				) : (
					/* Populated Wishlist Grid */
					<div className="space-y-8">
						{/* Sub-bar with count and clear button */}
						<div className="flex items-center justify-between pb-4 border-b border-border/40">
							<span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
								{totalCount} {totalCount === 1 ? "Creation Curated" : "Creations Curated"}
							</span>
							<button
								type="button"
								onClick={clearWishlist}
								className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
							>
								<Trash2 className="size-3.5" />
								<span>Clear All</span>
							</button>
						</div>

						{/* Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
							{items.map((item) => (
								<div
									key={item.id}
									className="group bg-background border border-border/60 hover:border-foreground transition-all duration-300 flex flex-col justify-between"
								>
									<div>
										{/* Image Link */}
										<Link
											href={`/products/${item.slug}`}
											className="block relative aspect-3/4 bg-secondary/30 overflow-hidden"
										>
											{(() => {
												const preview = item.previewImage || getProductFallbackImage(item.slug, item.name);
												return (
													<img
														src={preview}
														alt={item.name}
														className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
													/>
												);
											})()}
											{/* Quick remove button */}
											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													removeItem(item.id);
												}}
												className="absolute top-3 right-3 size-8 rounded-full bg-background/80 hover:bg-background text-foreground/80 hover:text-destructive flex items-center justify-center backdrop-blur-md border border-border/50 transition-colors shadow-sm"
												aria-label="Remove from wishlist"
												title="Remove piece"
											>
												<Trash2 className="size-3.5" />
											</button>
										</Link>

										{/* Details */}
										<div className="p-4 space-y-1.5 border-t border-border/40">
											<span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground block">
												Certified Handloom
											</span>
											<Link
												href={`/products/${item.slug}`}
												className="font-serif text-sm sm:text-base font-normal tracking-tight text-foreground hover:underline block line-clamp-1"
											>
												{item.name}
											</Link>
											{item.currencyCode && (
												<div className="font-serif text-sm font-light text-foreground/90 pt-0.5">
													{typeof item.price === "number" ? (
														<Price
															value={item.price}
															currencyCode={item.currencyCode}
														/>
													) : item.minPrice !== undefined ? (
														<div className="flex items-baseline gap-1">
															<span className="text-xs font-mono text-muted-foreground">
																from
															</span>
															<Price
																value={item.minPrice}
																currencyCode={item.currencyCode}
															/>
														</div>
													) : null}
												</div>
											)}
										</div>
									</div>

									{/* Bottom Action */}
									<div className="p-4 pt-0">
										<Button
											render={<Link href={`/products/${item.slug}`} />}
											nativeButton={false}
											className="w-full h-10 text-[10px] font-mono uppercase tracking-[0.2em] rounded-none bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2"
										>
											<ShoppingBag className="size-3.5" />
											<span>View Piece & Acquire</span>
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
