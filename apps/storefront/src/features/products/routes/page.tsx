import { Await } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type {
	getProductPageData,
	getRelatedProducts,
} from "@/features/products/catalog.functions";
import { ProductImageCarousel } from "@/features/products/components/product-image-carousel";
import { ProductInfo } from "@/features/products/components/product-info";
import { RelatedProducts } from "@/features/products/components/related-products";
import { useTranslations } from "@/platform/i18n/paraglide";
import { Link } from "@/platform/tanstack/navigation";

import { getProductFallbackGallery } from "@/features/products/product-fallback";

export default function ProductDetailPage({
	data,
	relatedProducts,
	searchParams,
}: {
	data: NonNullable<Awaited<ReturnType<typeof getProductPageData>>>["data"];
	relatedProducts: ReturnType<typeof getRelatedProducts>;
	searchParams: Record<string, string | undefined>;
}) {
	const t = useTranslations("Product");
	const { product, primaryCollection, productForDisplay, currencyCode } = data;
	const displayImages =
		product.assets && product.assets.length > 0
			? product.assets
			: getProductFallbackGallery(product.slug, product.name);

	return (
		// Below lg the purchase bar is pinned to the viewport bottom, so the page
		// reserves its height plus the browser safe area.
		<div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
			<div className="container mx-auto px-4 py-8 mt-16">
				{/* Breadcrumb Navigation */}
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink render={<Link href="/" />}>
								{t("home")}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{primaryCollection && (
							<>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink
										render={
											<Link href={`/collections/${primaryCollection.slug}`} />
										}
									>
										{primaryCollection.name}
									</BreadcrumbLink>
								</BreadcrumbItem>
							</>
						)}
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{product.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Left Column: Image Carousel */}
					<div className="lg:sticky lg:top-20 lg:self-start">
						<ProductImageCarousel images={displayImages} />
					</div>

					{/* Right Column: Product Info */}
					<div>
						<ProductInfo
							product={productForDisplay}
							searchParams={searchParams}
							currencyCode={currencyCode}
						/>
					</div>
				</div>
			</div>

			{/* Luxury Heritage & Client Guarantees */}
			<section className="py-10 mt-12 border-y border-border/50 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-wider text-foreground">Certified Handloom</p>
							<p className="text-[11px] text-muted-foreground">Direct from master weavers</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-wider text-foreground">Priority Worldwide Courier</p>
							<p className="text-[11px] text-muted-foreground">Discreet insured dispatch</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-wider text-foreground">Serialized Authenticity</p>
							<p className="text-[11px] text-muted-foreground">Lifetime archive certificate</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-wider text-foreground">Bespoke Concierge</p>
							<p className="text-[11px] text-muted-foreground">Tailoring & sizing assistance</p>
						</div>
					</div>
				</div>
			</section>

			<Await promise={relatedProducts} fallback={null}>
				{({ products, currencyCode: relatedCurrencyCode }) => (
					<RelatedProducts
						products={products}
						currencyCode={relatedCurrencyCode}
					/>
				)}
			</Await>
		</div>
	);
}
