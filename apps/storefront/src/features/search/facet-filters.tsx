import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { CatalogSearchParams } from "@/features/search/search-helpers";
import type { SearchProductsData } from "@/features/search/search-products-data";
import { useCatalogSearchNavigate } from "@/features/search/use-catalog-search";
import { useTranslations } from "@/platform/i18n/paraglide";

interface FacetFiltersProps {
	productData: SearchProductsData;
	searchParams: CatalogSearchParams;
}

function FilterContent({
	facetGroups,
	selectedFacets,
	toggleFacet,
	clearFilters,
	hasActiveFilters,
}: {
	facetGroups: Record<
		string,
		{
			id: string;
			name: string;
			values: Array<{ id: string; name: string; count: number }>;
		}
	>;
	selectedFacets: string[];
	toggleFacet: (facetId: string) => void;
	clearFilters: () => void;
	hasActiveFilters: boolean;
}) {
	const t = useTranslations("Filters");
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between pb-3 border-b border-border/60">
				<div>
					<span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground block">
						Refine By
					</span>
					<h2 className="font-serif text-xl font-light tracking-tight">{t("title")}</h2>
				</div>
				{hasActiveFilters && (
					<Button 
						variant="ghost" 
						size="sm" 
						onClick={clearFilters}
						className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground h-auto p-0"
					>
						{t("clearAll")}
					</Button>
				)}
			</div>

			{Object.entries(facetGroups).map(([facetName, facet]) => (
				<Collapsible key={facet.id} defaultOpen className="border-b border-border/40 pb-4">
					<div className="space-y-3">
						<CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-xs font-mono uppercase tracking-[0.2em] font-medium text-foreground hover:text-primary transition-colors">
							<span>{facetName}</span>
							<ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform [[data-panel-open]_&]:rotate-180" />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="space-y-2.5 pt-1">
								{facet.values.map((value) => {
									const isChecked = selectedFacets.includes(value.id);
									return (
										<div key={value.id} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleFacet(value.id)}>
											<div className="flex items-center space-x-2.5">
												<Checkbox
													id={`filter-${value.id}`}
													checked={isChecked}
													onCheckedChange={() => toggleFacet(value.id)}
													className="rounded-none border-border/80 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
												/>
												<Label
													htmlFor={`filter-${value.id}`}
													className="text-xs font-sans font-normal cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors"
												>
													{value.name}
												</Label>
											</div>
											<span className="text-[10px] font-mono text-muted-foreground/60">
												{value.count}
											</span>
										</div>
									);
								})}
							</div>
						</CollapsibleContent>
					</div>
				</Collapsible>
			))}
		</div>
	);
}

interface FacetGroup {
	id: string;
	name: string;
	values: Array<{ id: string; name: string; count: number }>;
}

const DEFAULT_FASHION_FACETS: Record<string, FacetGroup> = {
	"Craft & Textile": {
		id: "5",
		name: "Craft & Textile",
		values: [
			{ id: "54", name: "Muslin Jamdani", count: 2 },
			{ id: "55", name: "Mulberry Silk", count: 1 },
			{ id: "56", name: "Chanderi Zari", count: 1 },
			{ id: "57", name: "Handspun Khadi", count: 2 },
			{ id: "58", name: "Kantha Stitch", count: 1 },
			{ id: "59", name: "Katan Brocade", count: 1 },
		],
	},
	Silhouette: {
		id: "6",
		name: "Silhouette",
		values: [
			{ id: "60", name: "Saree & Drape", count: 2 },
			{ id: "61", name: "Kurta & Tunic", count: 1 },
			{ id: "62", name: "Tailored Outerwear", count: 2 },
			{ id: "63", name: "Stole & Scarf", count: 3 },
		],
	},
	Palette: {
		id: "7",
		name: "Palette",
		values: [
			{ id: "64", name: "Alabaster & Gold", count: 2 },
			{ id: "65", name: "Indigo Noir", count: 2 },
			{ id: "66", name: "Royal Ochre", count: 2 },
			{ id: "67", name: "Raw Terracotta", count: 2 },
		],
	},
};

export function FacetFilters({ productData, searchParams }: FacetFiltersProps) {
	const t = useTranslations("Filters");
	const searchResult = productData.data.search;
	const navigateCatalogSearch = useCatalogSearchNavigate();
	const [sheetOpen, setSheetOpen] = useState(false);

	const parsedFacetGroups = (searchResult.facetValues || []).reduce(
		(acc: Record<string, FacetGroup>, item) => {
			if (!item?.facetValue?.facet) return acc;
			const facetName = item.facetValue.facet.name;
			if (!acc[facetName]) {
				acc[facetName] = {
					id: item.facetValue.facet.id,
					name: facetName,
					values: [],
				};
			}
			acc[facetName].values.push({
				id: item.facetValue.id,
				name: item.facetValue.name,
				count: item.count,
			});
			return acc;
		},
		{},
	);

	const facetGroups =
		Object.keys(parsedFacetGroups).length > 0
			? parsedFacetGroups
			: DEFAULT_FASHION_FACETS;

	const selectedFacets = searchParams.facets || [];

	// Reset to page 1 whenever the facet selection changes
	const applyFacets = (facets: string[]) => {
		navigateCatalogSearch({ facets, page: 1 });
		setSheetOpen(false);
	};

	const toggleFacet = (facetId: string) => {
		applyFacets(
			selectedFacets.includes(facetId)
				? selectedFacets.filter((id) => id !== facetId)
				: [...selectedFacets, facetId],
		);
	};

	const clearFilters = () => {
		applyFacets([]);
	};

	const hasActiveFilters = selectedFacets.length > 0;

	const filterContentProps = {
		facetGroups,
		selectedFacets,
		toggleFacet,
		clearFilters,
		hasActiveFilters,
	};

	return (
		<>
			{/* Mobile: Sheet trigger */}
			<div className="lg:hidden">
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger
						render={
							<Button variant="outline" className="w-full">
								<SlidersHorizontal className="mr-2 h-4 w-4" />
								{t("filtersButton")}
								{hasActiveFilters && (
									<span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
										{selectedFacets.length}
									</span>
								)}
							</Button>
						}
					/>
					<SheetContent side="left" className="overflow-y-auto p-6">
						<SheetHeader>
							<SheetTitle>{t("title")}</SheetTitle>
						</SheetHeader>
						<div className="mt-4">
							<FilterContent {...filterContentProps} />
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop: Inline filters */}
			<div className="hidden lg:block">
				<FilterContent {...filterContentProps} />
			</div>
		</>
	);
}
