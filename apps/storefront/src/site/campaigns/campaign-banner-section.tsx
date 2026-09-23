import { ArrowRight } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";
import type { CampaignBanner } from "@/features/campaigns/campaign.types";

interface CampaignBannerSectionProps {
    banners?: CampaignBanner[];
}

export function CampaignBannerSection({ banners }: CampaignBannerSectionProps) {
    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-background border-b border-border/40">
            <div className="container mx-auto px-4">
                <div className={`grid gap-6 ${banners.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl border border-border/50 bg-black min-h-65 sm:min-h-80 flex items-end p-6 sm:p-8"
                        >
                            <img
                                src={banner.imageUrl}
                                alt={banner.headline || "Campaign Banner"}
                                className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                            <div className="relative z-10 space-y-3 max-w-lg">
                                {banner.headline && (
                                    <h3 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-tight">
                                        {banner.headline}
                                    </h3>
                                )}

                                {banner.href && (
                                    <Link
                                        href={banner.href}
                                        className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-[0.2em] uppercase text-white/90 hover:text-white group-hover:translate-x-1 transition-all"
                                    >
                                        <span>Discover Collection</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
