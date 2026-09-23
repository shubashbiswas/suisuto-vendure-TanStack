import { Heart } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import { cn } from "@/lib/utils";

export function WishlistIcon() {
	const { totalCount } = useWishlist();

	return (
		<Link
			href="/wishlist"
			className="relative h-9 px-2 flex items-center justify-center text-foreground hover:bg-secondary/50 border border-transparent hover:border-border/60 transition-all group"
			aria-label={`Private Wishlist (${totalCount} pieces saved)`}
			title="Private Atelier Wishlist"
		>
			<Heart
				className={cn(
					"size-4.5 stroke-[1.5] transition-transform duration-200 group-hover:scale-110",
					totalCount > 0 ? "fill-rose-500 text-rose-500" : "text-foreground/80"
				)}
			/>
			{totalCount > 0 && (
				<span className="absolute -top-0.5 -right-0.5 size-4 bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center rounded-full animate-in zoom-in-50 duration-200">
					{totalCount}
				</span>
			)}
		</Link>
	);
}
