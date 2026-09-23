import { useEffect, useState, useTransition } from "react";
import Image from "@/components/storefront-image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Price } from "@/features/pricing/price";
import { adjustQuantity, removeFromCart, type CartActionResult } from "@/features/cart/routes/actions";
import { getCartRouteData } from "@/features/cart/cart.functions";
import { useCartDrawer } from "@/features/cart/context/cart-drawer-context";
import { Link, useRouter } from "@/platform/tanstack/navigation";
import { useServerFn } from "@tanstack/react-start";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getProductFallbackImage } from "@/features/products/product-fallback";

type OrderType = Awaited<ReturnType<typeof getCartRouteData>>;

export function CartDrawer() {
	const { isOpen, closeCartDrawer } = useCartDrawer();
	const router = useRouter();
	const [activeOrder, setActiveOrder] = useState<OrderType | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isPending, startTransition] = useTransition();

	const fetchCart = useServerFn(getCartRouteData);
	const adjust = useServerFn(adjustQuantity);
	const remove = useServerFn(removeFromCart);

	const loadCart = async () => {
		try {
			setIsLoading(true);
			const order = await fetchCart();
			setActiveOrder(order);
		} catch {
			// fallback
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			loadCart();
		}
	}, [isOpen]);

	const handleAction = (mutation: () => Promise<CartActionResult>) => {
		startTransition(async () => {
			const result = await mutation();
			if (!result.success) {
				toast.error(result.message);
			} else {
				await loadCart();
				router.refresh();
			}
		});
	};

	const totalItems = activeOrder?.totalQuantity ?? 0;
	const subtotal = activeOrder?.subTotalWithTax ?? 0;
	const currency = activeOrder?.currencyCode ?? "USD";
	const freeShippingThreshold = 25000; // in cents/subunits
	const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
	const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCartDrawer()}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border/80"
			>
				{/* Drawer Header */}
				<div className="p-5 border-b border-border/60 flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<ShoppingBag className="size-5 text-primary" />
						<h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
							Shopping Bag
						</h2>
						{totalItems > 0 && (
							<span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
								{totalItems}
							</span>
						)}
					</div>
				</div>

				{/* Free Shipping Progress Meter */}
				<div className="px-5 py-3.5 bg-secondary/30 border-b border-border/40 text-xs">
					{amountToFreeShipping === 0 ? (
						<p className="font-medium text-emerald-600 dark:text-emerald-400">
							✨ You have unlocked <span className="font-semibold">Complimentary Worldwide Express Delivery</span>.
						</p>
					) : (
						<p className="text-muted-foreground">
							Add <span className="font-semibold text-foreground"><Price value={amountToFreeShipping} currencyCode={currency} /></span> more for complimentary express delivery.
						</p>
					)}
					<div className="w-full bg-border/60 h-1.5 rounded-full mt-2 overflow-hidden">
						<div
							className="bg-primary h-full transition-all duration-500 ease-out"
							style={{ width: `${freeShippingPercent}%` }}
						/>
					</div>
				</div>

				{/* Drawer Body: Line Items */}
				<div className="flex-1 overflow-y-auto p-5 divide-y divide-border/40">
					{isLoading && !activeOrder ? (
						<div className="py-20 text-center space-y-3">
							<div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
							<p className="text-xs text-muted-foreground tracking-widest uppercase">Opening Atelier Bag...</p>
						</div>
					) : !activeOrder || activeOrder.lines.length === 0 ? (
						<div className="py-24 text-center space-y-5">
							<div className="size-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto text-muted-foreground">
								<ShoppingBag className="size-7 stroke-[1.5]" />
							</div>
							<div className="space-y-1.5">
								<h3 className="font-serif text-xl font-semibold">Your bag is empty</h3>
								<p className="text-xs text-muted-foreground max-w-xs mx-auto">
									Explore our handcrafted haute couture and certified artisanal collections.
								</p>
							</div>
							<Button
								onClick={closeCartDrawer}
								render={<Link href="/collections/atelier" />}
								className="font-sans text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg"
							>
								Explore The Edit
							</Button>
						</div>
					) : (
						activeOrder.lines.map((line) => {
							const product = line.productVariant.product;
							const preview = product.featuredAsset?.preview || getProductFallbackImage(product.slug, product.name);

							return (
								<div key={line.id} className="py-4.5 first:pt-0 last:pb-0 flex gap-4">
									<div className="size-20 shrink-0 bg-secondary/30 rounded-lg overflow-hidden relative border border-border/50">
										{preview ? (
											<Image
												src={preview}
												alt={product.name}
												fill
												className="object-cover"
												sizes="80px"
											/>
										) : (
											<div className="size-full flex items-center justify-center text-xs text-muted-foreground">
												Atelier
											</div>
										)}
									</div>

									<div className="flex-1 min-w-0 flex flex-col justify-between">
										<div className="space-y-0.5">
											<Link
												href={`/products/${product.slug}`}
												onClick={closeCartDrawer}
												className="font-serif text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 block"
											>
												{product.name}
											</Link>
											<p className="text-xs text-muted-foreground font-sans line-clamp-1">
												{line.productVariant.name}
											</p>
											<div className="text-sm font-medium text-foreground pt-1">
												<Price value={line.unitPriceWithTax} currencyCode={currency} />
											</div>
										</div>

										<div className="flex items-center justify-between pt-2">
											<div className="flex items-center border border-border/60 rounded-md bg-secondary/20">
												<button
													type="button"
													disabled={isPending || line.quantity <= 1}
													onClick={() =>
														handleAction(() =>
															adjust({
																data: {
																	lineId: line.id,
																	quantity: line.quantity - 1,
																},
															}),
														)
													}
													className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer"
													aria-label="Decrease quantity"
												>
													<Minus className="size-3" />
												</button>
												<span className="w-8 text-center text-xs font-semibold select-none">
													{line.quantity}
												</span>
												<button
													type="button"
													disabled={isPending}
													onClick={() =>
														handleAction(() =>
															adjust({
																data: {
																	lineId: line.id,
																	quantity: line.quantity + 1,
																},
															}),
														)
													}
													className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
													aria-label="Increase quantity"
												>
													<Plus className="size-3" />
												</button>
											</div>

											<button
												type="button"
												disabled={isPending}
												onClick={() =>
													handleAction(() =>
														remove({
															data: { lineId: line.id },
														}),
													)
												}
												className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
												aria-label="Remove item"
											>
												<Trash2 className="size-4" />
											</button>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Drawer Footer */}
				{activeOrder && activeOrder.lines.length > 0 && (
					<div className="p-5 border-t border-border/60 bg-background/95 space-y-4">
						<div className="space-y-1.5 text-xs">
							<div className="flex justify-between items-center text-sm font-semibold text-foreground">
								<span>Estimated Subtotal</span>
								<span className="font-serif text-lg font-bold">
									<Price value={subtotal} currencyCode={currency} />
								</span>
							</div>
							<p className="text-[11px] text-muted-foreground">
								Taxes, local customs duties, and courier dispatch calculated at checkout.
							</p>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<Button
								variant="outline"
								render={<Link href="/cart" />}
								onClick={closeCartDrawer}
								className="h-11 font-sans text-xs tracking-wider uppercase rounded-lg border-border"
							>
								View Full Bag
							</Button>
							<Button
								render={<Link href="/cart" />}
								onClick={closeCartDrawer}
								className="h-11 font-sans text-xs tracking-wider uppercase font-semibold rounded-lg bg-primary text-primary-foreground flex items-center justify-center gap-1.5 group"
							>
								<span>Checkout</span>
								<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
							</Button>
						</div>

						<p className="text-[10px] text-center text-muted-foreground tracking-widest uppercase">
							Discreet Climate-Neutral Luxury Packaging Guaranteed
						</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
