import { Heart } from "lucide-react";
import { useWishlist, type WishlistItem } from "@/features/wishlist/context/wishlist-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface WishlistButtonProps {
	item: WishlistItem;
	className?: string;
	size?: "sm" | "default" | "lg";
	showLabel?: boolean;
}

export function WishlistButton({
	item,
	className,
	size = "default",
	showLabel = false,
}: WishlistButtonProps) {
	const { isInWishlist, toggleItem } = useWishlist();
	const active = isInWishlist(item.id);
	const [animating, setAnimating] = useState(false);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setAnimating(true);
		toggleItem(item);
		setTimeout(() => setAnimating(false), 300);
	};

	const iconSize = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"relative inline-flex items-center justify-center transition-all duration-300 select-none",
				showLabel
					? "h-11 px-5 gap-2 border border-border/70 hover:border-foreground text-xs font-mono tracking-widest uppercase bg-background hover:bg-secondary/40"
					: "size-8.5 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md border border-border/40 hover:border-foreground/60 shadow-sm",
				animating && "scale-125",
				className
			)}
			aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
			title={active ? "Remove from Private Wishlist" : "Save to Private Wishlist"}
		>
			<Heart
				className={cn(
					iconSize,
					"transition-all duration-300",
					active
						? "fill-rose-500 text-rose-500 scale-110"
						: "text-foreground/75 hover:text-rose-500"
				)}
			/>
			{showLabel && (
				<span className="font-medium text-[11px]">
					{active ? "Curated In Wishlist" : "Curate Piece"}
				</span>
			)}
		</button>
	);
}
