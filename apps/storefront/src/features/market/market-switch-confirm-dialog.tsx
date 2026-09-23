import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { ShoppingBag, ArrowRight } from "lucide-react";
import type { RegionConfig } from "@/platform/region/region.types";

interface MarketSwitchConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRegionName: string;
	currentCurrency: string;
	targetRegion?: RegionConfig | null;
	cartItemCount: number;
	onConfirm: () => void;
	onCancel?: () => void;
}

export function MarketSwitchConfirmDialog({
	open,
	onOpenChange,
	currentRegionName,
	currentCurrency,
	targetRegion,
	cartItemCount,
	onConfirm,
	onCancel,
}: MarketSwitchConfirmDialogProps) {
	if (!targetRegion) return null;

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-md p-6 bg-background border border-border/60 shadow-2xl rounded-none">
				<AlertDialogHeader className="space-y-3">
					<div className="flex items-center gap-2 text-amber-500 text-xs font-mono tracking-widest uppercase">
						<ShoppingBag className="size-4" />
						<span>Active Shopping Bag Notice</span>
					</div>
					<AlertDialogTitle className="font-serif text-xl tracking-wide font-normal">
						Switching to {targetRegion.name} ({targetRegion.currencyCode})?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed space-y-2">
						<p>
							You have <strong className="text-foreground font-semibold">{cartItemCount} item{cartItemCount > 1 ? "s" : ""}</strong> in your {currentRegionName} ({currentCurrency}) shopping bag.
						</p>
						<p>
							Each market operates with dedicated catalog pricing, domestic logistics, and artisan fulfillment hubs. Items cannot be merged across different market currencies.
						</p>
						<div className="p-3 bg-secondary/60 border border-border/40 text-[11px] text-foreground/90 font-mono mt-2">
							✓ Your current bag will remain safely preserved in {currentRegionName} whenever you return.
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
					<AlertDialogCancel
						onClick={onCancel}
						className="rounded-none text-xs uppercase font-mono tracking-wider"
					>
						Keep Shopping in {currentRegionName}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="rounded-none text-xs uppercase font-mono tracking-wider bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-1.5"
					>
						<span>Switch Market</span>
						<ArrowRight className="size-3" />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
