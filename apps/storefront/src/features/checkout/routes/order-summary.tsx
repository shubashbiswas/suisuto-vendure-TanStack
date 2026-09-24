import { useState } from "react";
import Image from "@/components/storefront-image";
import { ChevronDown, ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { OrderLine } from "./types";
import { useCheckout } from "./checkout-provider";
import { Price } from "@/features/pricing/price";
import { useTranslations } from "@/platform/i18n/paraglide";
import { getProductFallbackImage } from "@/features/products/product-fallback";

function OrderSummaryContent({
	order,
	t,
}: {
	order: ReturnType<typeof useCheckout>["order"];
	t: ReturnType<typeof useTranslations<"Checkout">>;
}) {
	return (
		<div className="space-y-4">
			<div className="space-y-3 max-h-72 overflow-y-auto pr-1">
				{order.lines.map((line: OrderLine) => {
					const product = line.productVariant.product;
					const preview =
						product.featuredAsset?.preview ||
						getProductFallbackImage(product.slug, product.name);

					return (
						<div key={line.id} className="flex gap-3 items-center">
							<div className="shrink-0 size-14 rounded-none overflow-hidden bg-secondary/30 relative border border-border/50">
								{preview ? (
									<Image
										src={preview}
										alt={line.productVariant.name}
										width={56}
										height={56}
										className="object-cover size-full"
									/>
								) : (
									<div className="size-full flex items-center justify-center text-[10px] text-muted-foreground uppercase font-mono">
										Atelier
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0 space-y-0.5">
								<p className="text-xs font-serif font-medium text-foreground line-clamp-1">
									{product.name}
								</p>
								<p className="text-[11px] text-muted-foreground line-clamp-1">
									{line.productVariant.name}
								</p>
								<p className="text-[10px] font-mono text-muted-foreground/80">
									{t("qty", { quantity: line.quantity })}
								</p>
							</div>
							<div className="text-xs font-serif font-semibold text-foreground text-right shrink-0">
								<Price
									value={line.linePriceWithTax}
									currencyCode={order.currencyCode}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<Separator className="bg-border/60" />

			<div className="space-y-2 text-xs">
				<div className="flex justify-between">
					<span className="text-muted-foreground">{t("subtotal")}</span>
					<span className="font-medium text-foreground">
						<Price
							value={order.subTotalWithTax}
							currencyCode={order.currencyCode}
						/>
					</span>
				</div>

				{order.discounts &&
					order.discounts.length > 0 &&
					order.discounts.map((discount, index: number) => (
						<div
							key={index}
							className="flex justify-between text-emerald-600 dark:text-emerald-400"
						>
							<span className="flex items-center gap-1">
								<Sparkles className="size-3" />
								{discount.description}
							</span>
							<span className="font-medium">
								-
								<Price
									value={discount.amountWithTax}
									currencyCode={order.currencyCode}
								/>
							</span>
						</div>
					))}

				<div className="flex justify-between">
					<span className="text-muted-foreground">{t("shipping")}</span>
					<span className="font-medium text-foreground">
						{order.shippingWithTax > 0 ? (
							<Price
								value={order.shippingWithTax}
								currencyCode={order.currencyCode}
							/>
						) : (
							<span className="text-emerald-600 dark:text-emerald-400 font-medium">
								Complimentary
							</span>
						)}
					</span>
				</div>
			</div>

			<Separator className="bg-border/60" />

			<div className="flex justify-between items-baseline pt-1">
				<div>
					<span className="font-serif text-base tracking-tight uppercase block">
						{t("total")}
					</span>
					<span className="text-[10px] text-muted-foreground font-mono">
						Including duties & regional VAT
					</span>
				</div>
				<span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
					<Price value={order.totalWithTax} currencyCode={order.currencyCode} />
				</span>
			</div>

			<div className="p-3 bg-secondary/30 border border-border/50 text-[11px] text-muted-foreground space-y-1">
				<div className="flex items-center gap-1.5 text-foreground font-medium">
					<ShieldCheck className="size-3.5 text-primary" />
					<span>Suisuto Atelier Assurance</span>
				</div>
				<p>
					Complimentary insured express dispatch, verified authenticity certificate, and signature luxury packaging.
				</p>
			</div>
		</div>
	);
}

export default function OrderSummary() {
	const t = useTranslations("Checkout");
	const { order } = useCheckout();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Mobile: Collapsible summary */}
			<div className="lg:hidden border border-border/70 bg-card p-4">
				<Collapsible open={isOpen} onOpenChange={setIsOpen}>
					<CollapsibleTrigger className="w-full text-left">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<ShoppingBag className="size-4 text-primary" />
								<span className="font-serif text-base font-semibold">
									{t("orderSummary")} ({order.lines.length})
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-serif font-semibold text-base">
									<Price
										value={order.totalWithTax}
										currencyCode={order.currencyCode}
									/>
								</span>
								<ChevronDown
									className={`size-4 text-muted-foreground transition-transform duration-200 ${
										isOpen ? "rotate-180" : ""
									}`}
								/>
							</div>
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-4 mt-3 border-t border-border/60">
						<OrderSummaryContent order={order} t={t} />
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Desktop: Always visible sticky summary */}
			<div className="hidden lg:block">
				<div className="border border-border/70 bg-card p-6 sticky top-24 space-y-4">
					<div className="flex items-center justify-between pb-3 border-b border-border/60">
						<div className="flex items-center gap-2">
							<ShoppingBag className="size-4 text-primary" />
							<h2 className="font-serif text-xl font-medium tracking-tight">
								{t("orderSummary")}
							</h2>
						</div>
						<span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
							{order.lines.reduce((acc, l) => acc + l.quantity, 0)} Items
						</span>
					</div>
					<OrderSummaryContent order={order} t={t} />
				</div>
			</div>
		</>
	);
}
