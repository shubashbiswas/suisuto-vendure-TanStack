import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { getCountryFlag } from "@/platform/region/region.types.ts";

export interface OriginBadgeProps {
	originHub?: string | null;
	variant?: "compact" | "full";
	className?: string;
}

export function OriginBadge({
	originHub,
	variant = "compact",
	className,
}: OriginBadgeProps) {
	const raw = (originHub || "").trim();
	const rawLower = raw.toLowerCase();

	let countryCode = "global";
	let hubName = "Atelier Hub";
	let description = "Crafted and fulfilled by certified artisan cooperatives.";

	if (!raw || rawLower.includes("global") || rawLower.includes("cross-border") || rawLower.includes("dual")) {
		countryCode = "global";
		hubName = "Cross-Border Hub";
		description = "Curated dual-sourcing collection fulfilling across regional artisan partner hubs.";
	} else {
		const potentialCode = raw.includes("_") ? raw.split("_")[0].toUpperCase() : raw.slice(0, 2).toUpperCase();
		let displayName = "";
		try {
			displayName = new Intl.DisplayNames(["en"], { type: "region" }).of(potentialCode) || "";
		} catch {
			displayName = "";
		}

		if (displayName && potentialCode.length === 2) {
			countryCode = potentialCode;
			hubName = `${displayName} Hub`;
			description = `Authentic heritage pieces dispatched directly from our certified ${displayName} fulfillment atelier.`;
		} else {
			countryCode = "global";
			hubName = raw.includes(" ") ? raw : `${raw} Hub`;
			description = `Artisan garments dispatched directly from ${hubName} fulfillment facility.`;
		}
	}

	const flag = countryCode === "global" ? "🌐" : getCountryFlag(countryCode);

	if (variant === "compact") {
		return (
			<div
				className={cn(
					"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide shadow-xs backdrop-blur-md transition-all border border-border/40 bg-secondary/50 text-secondary-foreground",
					className,
				)}
			>
				<span className="text-xs">{flag}</span>
				<span>{hubName}</span>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"p-3 rounded-lg border border-border/50 bg-secondary/30 text-foreground text-xs flex items-start gap-3 transition-colors",
				className,
			)}
		>
			<span className="text-xl mt-0.5">{flag}</span>
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center gap-1.5">
					<span className="font-semibold text-sm">
						Crafted in {hubName}
					</span>
					<Sparkles className="size-3.5 text-primary/70" />
				</div>
				<p className="text-muted-foreground text-[11px] leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	);
}
