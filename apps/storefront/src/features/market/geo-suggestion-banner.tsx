import { useEffect, useState, useTransition } from "react";
import { Globe, X, ArrowRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { switchRegion } from "@/platform/region/switch-region.functions";
import { getCountryFlag, type RegionConfig } from "@/platform/region/region.types";
import { detectVisitorMarket } from "./geo-detection.functions";
import { MarketSwitchConfirmDialog } from "./market-switch-confirm-dialog";

const rootRoute = getRouteApi("__root__");

interface GeoSuggestionBannerProps {
    activeRegion?: string;
    availableRegions?: RegionConfig[];
}

export function GeoSuggestionBanner({
    activeRegion = "global",
    availableRegions = [],
}: GeoSuggestionBannerProps) {
    const [suggestedMarket, setSuggestedMarket] = useState<RegionConfig | null>(null);
    const [dismissed, setDismissed] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const rootData = rootRoute.useLoaderData();
    const detectMarket = useServerFn(detectVisitorMarket);
    const changeRegion = useServerFn(switchRegion);

    useEffect(() => {
        if (rootData?.personalized) {
            rootData.personalized.then((p: any) => {
                if (typeof p?.cartItemCount === "number") {
                    setCartCount(p.cartItemCount);
                }
            }).catch(() => {});
        }
    }, [rootData]);

    useEffect(() => {
        // Check if user already dismissed geo suggestion this session
        if (typeof window === "undefined") return;
        const isDismissed = sessionStorage.getItem("suisuto_geo_dismissed");
        if (isDismissed) return;

        detectMarket()
            .then((result) => {
                if (result?.suggestedMarket && result.suggestedMarket !== activeRegion) {
                    const match = availableRegions.find(
                        (r) => r.code.toLowerCase() === result.suggestedMarket?.toLowerCase()
                    );
                    if (match) {
                        setSuggestedMarket(match);
                        setDismissed(false);
                    }
                }
            })
            .catch(() => {});
    }, [activeRegion, availableRegions, detectMarket]);

    const handleDismiss = () => {
        setDismissed(true);
        if (typeof window !== "undefined") {
            sessionStorage.setItem("suisuto_geo_dismissed", "true");
        }
    };

    const executeSwitch = () => {
        if (!suggestedMarket) return;
        startTransition(async () => {
            await changeRegion({ data: { region: suggestedMarket.code } });
            handleDismiss();
            const targetUrl = suggestedMarket.code === "global" ? "/" : `/${suggestedMarket.code}`;
            window.location.href = targetUrl;
        });
    };

    const handleSwitch = () => {
        if (!suggestedMarket) return;
        if (cartCount > 0) {
            setIsConfirmOpen(true);
            return;
        }
        executeSwitch();
    };

    if (dismissed || !suggestedMarket) {
        return null;
    }

    const flag = getCountryFlag(suggestedMarket.code);

    return (
        <>
            <aside
                aria-label="Market suggestion"
                className="relative z-40 bg-zinc-950 text-white border-b border-white/10 px-4 py-2.5 text-xs font-sans shadow-md"
            >
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-center sm:text-left">
                        <span className="text-base leading-none">{flag}</span>
                        <Globe className="size-3.5 text-amber-400 shrink-0 hidden sm:inline" />
                        <p className="text-white/90">
                            We noticed you may be visiting from <strong className="text-white font-medium">{suggestedMarket.name}</strong>.
                            {" "}Would you like to shop regional collections with local pricing in {suggestedMarket.currencyCode}?
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            size="sm"
                            onClick={handleSwitch}
                            disabled={isPending}
                            className="h-7 px-3 text-[11px] font-mono tracking-wider uppercase bg-white text-black hover:bg-white/90 rounded-none flex items-center gap-1.5"
                        >
                            <span>Switch to {suggestedMarket.name}</span>
                            <ArrowRight className="size-3" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDismiss}
                            className="h-7 px-2 text-[11px] font-mono tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/10 rounded-none"
                        >
                            Stay Here
                        </Button>

                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="text-white/60 hover:text-white p-1 ml-1"
                            aria-label="Close market suggestion"
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                </div>
            </aside>

            <MarketSwitchConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                currentRegionName={activeRegion === "global" ? "Global" : activeRegion.toUpperCase()}
                currentCurrency={activeRegion === "in" ? "INR" : activeRegion === "bd" ? "BDT" : "USD"}
                targetRegion={suggestedMarket}
                cartItemCount={cartCount}
                onConfirm={() => {
                    setIsConfirmOpen(false);
                    executeSwitch();
                }}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </>
    );
}
