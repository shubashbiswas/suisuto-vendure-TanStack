import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductGrid } from "@/features/products/product-grid";
import { FacetFilters } from "@/features/search/facet-filters";
import {
	type CatalogSearchParams,
	getCurrentPage,
} from "@/features/search/search-helpers";
import type { SearchProductsData } from "@/features/search/search-products-data";
import { useTranslations } from "@/platform/i18n/paraglide";
import { Link } from "@/platform/tanstack/navigation";

interface CollectionPageProps {
	searchParams: CatalogSearchParams;
	collectionName: string;
	productData: SearchProductsData;
}

export default function CollectionPage({
	searchParams,
	collectionName,
	productData,
}: CollectionPageProps) {
	const t = useTranslations("Collection");
	const page = getCurrentPage(searchParams);
	const totalItems = productData.data.search.totalItems;

	return (
		<div className="min-h-screen bg-background pb-20">
			{/* Editorial Collection Header Banner */}
			<div className="border-b border-border/50 bg-secondary/15 py-12 md:py-16">
				<div className="container mx-auto px-4">
					<Breadcrumb className="mb-6">
						<BreadcrumbList className="text-xs">
							<BreadcrumbItem>
								<BreadcrumbLink render={<Link href="/" />}>
									{t("home")}
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="font-medium text-foreground">
									{collectionName}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="max-w-3xl space-y-2.5">
						<div className="inline-flex items-center gap-2 text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-primary/80">
							<span>The Atelier Edit</span>
							<span>·</span>
							<span>Autumn / Winter 2026</span>
						</div>
						<h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
							{collectionName}
						</h1>
						<p className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-1">
							Exquisite master-woven pieces meticulously crafted from certified indigenous threads. Each silhouette is individually finished by our premier artisanal ateliers.
						</p>
						<p className="text-xs font-sans text-muted-foreground/80 pt-1">
							Showing {totalItems} {totalItems === 1 ? "creation" : "creations"}
						</p>
					</div>
				</div>
			</div>

			{/* Main Catalog Grid & Filters */}
			<div className="container mx-auto px-4 py-10">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
					{/* Filters Sidebar */}
					<aside className="lg:col-span-1">
						<div className="sticky top-24">
							<FacetFilters productData={productData} searchParams={searchParams} />
						</div>
					</aside>

					{/* Product Grid */}
					<div className="lg:col-span-3">
						<ProductGrid
							productData={productData}
							currentPage={page}
							currentSort={searchParams.sort}
							take={12}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
