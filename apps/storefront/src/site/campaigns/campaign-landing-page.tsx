import { Sparkles, Tag, ChevronRight } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";
import { HomepageSectionRenderer } from "@/site/home/homepage-section-renderer";
import { CountdownSection } from "@/site/campaigns/countdown-section";
import { getOptimizedAssetUrl, getAssetSrcSet } from "@/platform/vendure/asset";
import type { CampaignLandingDataResult } from "@/features/campaigns/campaign-landing.functions";

export function CampaignLandingPage({
    data,
}: {
    data: CampaignLandingDataResult;
}) {
    const { campaign, activeLandingPage, sections, products, currencyCode } = data;

    const heroImage = campaign.heroImageUrl || "/images/hero-campaign.jpg";
    const heroHeadline = activeLandingPage?.title || campaign.heroHeadline || campaign.name;
    const heroSub =
        activeLandingPage?.seoDescription ||
        campaign.heroSubHeadline ||
        `Celebrate the season with exclusive limited editions and curated creations.`;

    const subPages = campaign.landingPages || [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Editorial Breadcrumbs */}
            <nav aria-label="Breadcrumb navigation" className="bg-background/80 border-b border-border/40 py-2.5 px-4 text-[11px]">
                <div className="container mx-auto flex items-center gap-2 text-muted-foreground font-mono uppercase tracking-wider">
                    <Link href="/" className="hover:text-foreground transition-colors">Atelier</Link>
                    <ChevronRight className="size-3 opacity-60" />
                    <Link href={`/campaign/${campaign.slug}`} className="hover:text-foreground transition-colors">
                        {campaign.name}
                    </Link>
                    {activeLandingPage && (
                        <>
                            <ChevronRight className="size-3 opacity-60" />
                            <span className="text-foreground font-semibold">{activeLandingPage.title}</span>
                        </>
                    )}
                </div>
            </nav>

            {/* Promotion Header Alert if promo code exists */}
            {campaign.promotionCode && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 text-center text-xs font-mono tracking-wider text-amber-300">
                    <span className="inline-flex items-center gap-2">
                        <Tag className="size-3.5" />
                        <span>
                            Seasonal Privilege: Use code{" "}
                            <strong className="underline underline-offset-4 tracking-widest uppercase">
                                {campaign.promotionCode}
                            </strong>{" "}
                            at checkout
                        </span>
                    </span>
                </div>
            )}

            {/* Campaign Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center bg-black text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={getOptimizedAssetUrl(heroImage, { width: 1920, format: "webp" })}
                        srcSet={getAssetSrcSet(heroImage) || undefined}
                        sizes="100vw"
                        alt={heroHeadline}
                        className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto px-4 py-20 text-center max-w-4xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-white/20 bg-black/40 backdrop-blur-md text-[10.5px] font-mono tracking-[0.25em] uppercase text-white/90">
                        <Sparkles className="size-3 text-amber-400" />
                        <span>{campaign.name} Exclusive</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-tight leading-[1.05]">
                        {heroHeadline}
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto font-sans leading-relaxed tracking-wide">
                        {heroSub}
                    </p>

                    {/* Sub-pages navigation bar */}
                    {subPages.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                            <Link
                                href={`/campaign/${campaign.slug}`}
                                className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border transition-all ${
                                    !activeLandingPage
                                        ? "border-white bg-white text-black font-semibold"
                                        : "border-white/30 text-white/80 hover:border-white hover:text-white"
                                }`}
                            >
                                Overview
                            </Link>
                            {subPages.map((page) => {
                                const isActive =
                                    activeLandingPage?.subSlug.toLowerCase() ===
                                    page.subSlug.toLowerCase();
                                return (
                                    <Link
                                        key={page.subSlug}
                                        href={`/campaign/${campaign.slug}/${page.subSlug}`}
                                        className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border transition-all ${
                                            isActive
                                                ? "border-white bg-white text-black font-semibold"
                                                : "border-white/30 text-white/80 hover:border-white hover:text-white"
                                        }`}
                                    >
                                        {page.title}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Client-side Countdown if campaign has endAt */}
            {campaign.endAt && (
                <CountdownSection
                    targetDate={campaign.endAt}
                    headline={`${campaign.name} Concludes In`}
                />
            )}

            {/* Campaign Dynamic Sections */}
            {sections && sections.length > 0 ? (
                sections.map((section, idx) => (
                    <HomepageSectionRenderer
                        key={`${section.type}-${idx}`}
                        section={section}
                        products={products}
                        currencyCode={currencyCode}
                        campaign={campaign}
                    />
                ))
            ) : (
                /* Default showcase if no specific sections configured */
                <section className="py-20 bg-background border-b border-border/40">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                            <div className="space-y-2">
                                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-primary/80">
                                    Curated Selection
                                </span>
                                <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                                    {campaign.name} Pieces
                                </h2>
                            </div>
                        </div>

                        {/* Products rendered through HomepageSectionRenderer */}
                        <HomepageSectionRenderer
                            section={{ type: "featured-collection" }}
                            products={products}
                            currencyCode={currencyCode}
                            campaign={campaign}
                        />
                    </div>
                </section>
            )}
        </div>
    );
}
