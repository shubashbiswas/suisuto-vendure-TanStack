import { useTranslations } from "@/platform/i18n/paraglide";

interface SearchTermProps {
	searchParams: { q?: string };
}

export function SearchTerm({ searchParams }: SearchTermProps) {
	const searchTerm = searchParams.q || "";
	const t = useTranslations("Search");

	return (
		<div className="border-b border-border/50 bg-secondary/15 py-12 mb-10">
			<div className="container mx-auto px-4 space-y-2">
				<p className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-primary/80">
					Catalogue Search
				</p>
				<h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-foreground">
					{searchTerm ? t("resultsFor", { query: `"${searchTerm}"` }) : "All Haute Couture Pieces"}
				</h1>
			</div>
		</div>
	);
}

export function SearchTermSkeleton() {
	return (
		<div className="border-b border-border/50 bg-secondary/15 py-12 mb-10">
			<div className="container mx-auto px-4 space-y-2">
				<div className="h-4 w-32 bg-secondary rounded animate-pulse" />
				<div className="h-10 w-72 bg-secondary rounded animate-pulse" />
			</div>
		</div>
	);
}
