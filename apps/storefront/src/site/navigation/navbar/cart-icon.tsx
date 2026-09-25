import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartDrawer } from "@/features/cart/context/cart-drawer-context";
import { useTranslations } from "@/platform/i18n/paraglide";

interface CartIconProps {
	cartItemCount: number;
}

export function CartIcon({ cartItemCount }: CartIconProps) {
	const t = useTranslations("Navigation");
	const { openCartDrawer } = useCartDrawer();

	return (
		<Button
			onClick={openCartDrawer}
			variant="ghost"
			size="sm"
			className="relative size-11 md:size-9 h-9 px-2.5 gap-1.5 text-xs font-mono uppercase tracking-widest text-foreground hover:bg-secondary/50 rounded-none border border-transparent hover:border-border/60 transition-all group"
			aria-label={t("shoppingCart")}
		>
			<ShoppingBag className="size-4 stroke-[1.5] group-hover:scale-105 transition-transform" />
			<span className="hidden sm:inline-block text-[11px] font-medium tracking-wider">
				Bag
			</span>
			{cartItemCount > 0 ? (
				<span className="size-4.5 bg-foreground text-background text-[9px] font-mono font-bold flex items-center justify-center animate-in zoom-in-50 duration-200">
					{cartItemCount}
				</span>
			) : (
				<span className="hidden sm:inline-block text-muted-foreground text-[10px]">
					(0)
				</span>
			)}
			<span className="sr-only">{t("shoppingCart")}</span>
		</Button>
	);
}
