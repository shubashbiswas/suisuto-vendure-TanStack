import React from "react";
import type { ProductCardFragment } from "@/features/products/graphql";
import type { FragmentOf } from "@/platform/vendure/graphql";
import { CollectionsMatrix } from "@/site/home/collections-matrix";
import { HomepageSectionRenderer } from "@/site/home/homepage-section-renderer";
import type { Campaign, HomepageSectionConfig } from "@/features/campaigns/campaign.types";
import { DEFAULT_SECTIONS } from "@/features/campaigns/market-experience.config";

class SectionErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.warn("[HomepageSectionRenderer] Caught section render error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return null;
		}
		return this.props.children;
	}
}

export default function Home({
	products = [],
	collections = [],
	currencyCode = "USD",
	homepageSections,
	campaign,
}: {
	products?: Array<FragmentOf<typeof ProductCardFragment>>;
	collections?: Array<{ id: string; name: string; slug: string }>;
	currencyCode?: string;
	homepageSections?: HomepageSectionConfig[];
	campaign?: Campaign | null;
}) {
	const sections = homepageSections && homepageSections.length > 0 ? homepageSections : DEFAULT_SECTIONS;

	return (
		<div className="min-h-screen bg-background">
			{sections.map((section, index) => (
				<React.Fragment key={`${section.type}-${index}`}>
					<SectionErrorBoundary>
						<HomepageSectionRenderer
							section={section}
							products={products}
							collections={collections}
							currencyCode={currencyCode}
							campaign={campaign}
						/>
						{/* Show Collections Matrix under the Hero if collections exist */}
						{section.type === "hero" && collections && collections.length > 0 && (
							<CollectionsMatrix collections={collections} />
						)}
					</SectionErrorBoundary>
				</React.Fragment>
			))}
		</div>
	);
}
