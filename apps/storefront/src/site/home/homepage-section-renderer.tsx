import { Award, Clock, ShieldCheck, Sparkles, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/platform/tanstack/navigation";
import { FeaturedProducts } from "@/features/products/featured-products";
import type { ProductCardFragment } from "@/features/products/graphql";
import type { FragmentOf } from "@/platform/vendure/graphql";
import { HeroSection } from "@/site/home/hero-section";
import { ArtisanStory } from "@/site/home/artisan-story";
import { CountdownSection } from "@/site/home/countdown-section";
import { CampaignBannerSection } from "@/site/home/editorial-banner-section";
import { VideoBannerSection } from "@/site/home/video-banner-section";
import { FullWidthSlidesSection } from "@/site/home/full-width-slides-section";
import { SeasonalCollectionSection } from "@/site/home/seasonal-collection-section";
import { ShopByCategoryGrid } from "@/site/home/shop-by-category-grid";
import { ShopByBrandGrid } from "@/site/home/shop-by-brand-grid";
import { BestsellingSlidesSection } from "@/site/home/bestselling-slides-section";
import { NowTrendingSection } from "@/site/home/now-trending-section";
import { ShopTheMoodSection } from "@/site/home/shop-the-mood-section";
import { ScrollRevealSection } from "@/components/scroll-reveal-section";
import type { HomepageSectionConfig } from "@/markets";

const luxuryPillars = [
    {
        icon: Award,
        title: "Master Weaver Pedigree",
        description:
            "Every creation is handloomed by certified multi-generational artisans using ancient pit and jacquard looms.",
    },
    {
        icon: Clock,
        title: "Slow Fashion Ethos",
        description:
            "We produce in conscientious limited batches to avoid industrial excess and preserve heirloom fabric integrity.",
    },
    {
        icon: ShieldCheck,
        title: "Provenance & Authenticity",
        description:
            "Each bespoke piece is registered with a serialized certificate of authenticity verifying genuine handloom origin.",
    },
] as const;

export interface SectionSharedProps {
    products?: Array<FragmentOf<typeof ProductCardFragment>>;
    collections?: Array<{ id: string; name: string; slug: string }>;
    currencyCode: string;
}

export function FeaturedCollectionSection({
    products = [],
    currencyCode,
    title,
    subtitle,
    ctaHref,
    ctaLabel,
}: {
    products?: Array<FragmentOf<typeof ProductCardFragment>>;
    currencyCode: string;
    title?: string;
    subtitle?: string;
    ctaHref?: string;
    ctaLabel?: string;
}) {
    return (
        <section className="py-20 md:py-28 bg-background border-b border-border/40">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div className="space-y-2">
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-primary/80">
                            Current Edit
                        </span>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                            {title || "Featured Atelier Pieces"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-xs md:text-sm text-muted-foreground max-w-md font-sans hidden sm:block">
                            {subtitle || "Hand-selected garments from our master weaving clusters, ready for immediate direct dispatch."}
                        </p>
                        <Link
                            href={ctaHref || "/shop"}
                            className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors shrink-0"
                        >
                            {ctaLabel || "View All Pieces"} &rarr;
                        </Link>
                    </div>
                </div>

                <FeaturedProducts products={products} currencyCode={currencyCode} />
            </div>
        </section>
    );
}

export function AtelierPillarsSection() {
    return (
        <section className="py-20 md:py-28 bg-background border-b border-border/40">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-primary/80">
                        The Atelier Standard
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        Crafted Without Compromise
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-sans">
                        Honoring traditional textiles through ethical commissions, rigorous quality standards, and discreet worldwide delivery.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {luxuryPillars.map((pillar) => (
                        <div
                            key={pillar.title}
                            className="group relative text-center space-y-4 rounded-2xl border border-border/40 bg-card/50 p-8 md:p-10 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="size-14 mx-auto bg-secondary/80 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                                <pillar.icon className="size-6 stroke-[1.5]" />
                            </div>
                            <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">
                                {pillar.title}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-sans">
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function NewsletterSection() {
    return (
        <section className="py-24 bg-radial-[at_50%_50%] from-secondary/40 via-background to-background">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border/60 bg-background text-[10.5px] font-sans font-semibold tracking-[0.22em] uppercase text-muted-foreground">
                        <Sparkles className="size-3 text-amber-500" />
                        <span>Private Atelier Access</span>
                    </div>

                    <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Join The Suisuto Collector Circle
                    </h3>

                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto font-sans">
                        Receive private previews of limited seasonal loom drops, master-weaver archives, and bespoke atelier appointments.
                    </p>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
                    >
                        <div className="relative w-full">
                            <Mail className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full h-11 pl-10 pr-4 rounded-lg border border-border/80 bg-background text-xs font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="default"
                            className="w-full sm:w-auto h-11 px-7 text-xs font-sans font-semibold uppercase tracking-[0.2em] shrink-0 rounded-lg"
                        >
                            <span>Subscribe</span>
                            <ArrowRight className="size-3.5 ml-1.5" />
                        </Button>
                    </form>

                    <p className="text-[10.5px] text-muted-foreground/70 font-sans tracking-wider uppercase">
                        Discreet correspondence. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}

export function HomepageSectionRenderer({
    section,
    products = [],
    collections = [],
    currencyCode,
}: {
    section: HomepageSectionConfig;
    products?: Array<FragmentOf<typeof ProductCardFragment>>;
    collections?: Array<{
        id: string;
        name: string;
        slug: string;
        featuredAsset?: { id?: string; preview?: string } | null;
    }>;
    currencyCode: string;
}) {
    const props = section.props || {};

    switch (section.type) {
        case "hero": {
            return (
                <HeroSection
                    heroImageUrl={props.heroImageUrl}
                    heroHeadline={props.heroHeadline}
                    heroSubHeadline={props.heroSubHeadline}
                    heroCtaLabel={props.heroCtaLabel}
                    heroCtaHref={props.heroCtaHref}
                    heroTag={props.heroTag}
                />
            );
        }
        case "campaign-banner": {
            const banners = props.banners || [];
            return <ScrollRevealSection><CampaignBannerSection banners={banners} /></ScrollRevealSection>;
        }
        case "featured-collection":
        case "product-carousel": {
            return (
                <ScrollRevealSection>
                <FeaturedCollectionSection
                    products={products}
                    currencyCode={currencyCode}
                    title={props.title}
                    subtitle={props.subtitle}
                    ctaHref={props.ctaHref}
                    ctaLabel={props.ctaLabel}
                />
                </ScrollRevealSection>
            );
        }
        case "artisan-story": {
            return <ScrollRevealSection><ArtisanStory /></ScrollRevealSection>;
        }
        case "countdown": {
            const targetDate = props.targetDate;
            return (
                <ScrollRevealSection>
                <CountdownSection
                    targetDate={targetDate}
                    headline={props.headline}
                    subHeadline={props.subHeadline}
                />
                </ScrollRevealSection>
            );
        }
        case "newsletter": {
            return <ScrollRevealSection><NewsletterSection /></ScrollRevealSection>;
        }
        case "video-banner": {
            return (
                <ScrollRevealSection>
                <VideoBannerSection
                    videoUrl={props.videoUrl}
                    title={props.title}
                    subtitle={props.subtitle}
                    ctaHref={props.ctaHref}
                    ctaText={props.ctaText}
                />
                </ScrollRevealSection>
            );
        }
        case "full-width-slides": {
            return <ScrollRevealSection><FullWidthSlidesSection slides={props.slides} /></ScrollRevealSection>;
        }
        case "seasonal-collection": {
            return (
                <ScrollRevealSection>
                <SeasonalCollectionSection
                    title={props.title}
                    subtitle={props.subtitle}
                    bannerUrl={props.bannerUrl}
                    ctaHref={props.ctaHref}
                    ctaText={props.ctaText}
                />
                </ScrollRevealSection>
            );
        }
        case "category-grid-3x3": {
            return (
                <ScrollRevealSection>
                <ShopByCategoryGrid
                    categories={props.categories}
                    collections={collections}
                    badge={props.badge}
                    title={props.title}
                    subtitle={props.subtitle}
                />
                </ScrollRevealSection>
            );
        }
        case "brand-grid-3x3": {
            return (
                <ScrollRevealSection>
                <ShopByBrandGrid
                    brands={props.brands}
                    badge={props.badge}
                    title={props.title}
                    subtitle={props.subtitle}
                />
                </ScrollRevealSection>
            );
        }
        case "atelier-pillars": {
            return <ScrollRevealSection><AtelierPillarsSection /></ScrollRevealSection>;
        }
        case "bestselling-slides": {
            return (
                <ScrollRevealSection>
                <BestsellingSlidesSection
                    products={products}
                    currencyCode={currencyCode}
                    title={props.title}
                    subtitle={props.subtitle}
                />
                </ScrollRevealSection>
            );
        }
        case "now-trending": {
            return (
                <ScrollRevealSection>
                <NowTrendingSection
                    products={products}
                    currencyCode={currencyCode}
                    title={props.title}
                    subtitle={props.subtitle}
                />
                </ScrollRevealSection>
            );
        }
        case "shop-the-mood": {
            return (
                <ScrollRevealSection>
                <ShopTheMoodSection
                    moodTitle={props.moodTitle}
                    moodSubtitle={props.moodSubtitle}
                    moodCategory={props.moodCategory}
                    moodImageUrl={props.moodImageUrl}
                    ctaHref={props.ctaHref}
                />
                </ScrollRevealSection>
            );
        }
        default:
            return null;
    }
}
