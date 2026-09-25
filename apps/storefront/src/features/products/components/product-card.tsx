import { useState, useTransition } from "react";
import Image from "@/components/storefront-image";
import { Price } from "@/features/pricing/price";
import { ProductCardFragment } from "@/features/products/graphql";
import {
  PRODUCT_CAROUSEL_CARD_SIZES,
  PRODUCT_GRID_CARD_SIZES,
  productCardImageUrl,
  productCardSrcSet,
} from "@/features/products/product-image";
import { useTranslations } from "@/platform/i18n/paraglide";
import { Link, useRouter } from "@/platform/tanstack/navigation";
import { type FragmentOf, readFragment } from "@/platform/vendure/graphql";
import { WishlistButton } from "@/features/wishlist";
import { addToCart } from "@/features/products/add-to-cart.functions";
import { triggerCartDrawer } from "@/features/cart/context/cart-drawer-context";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { getProductFallbackImage } from "@/features/products/product-fallback";

interface ProductCardProps {
  product: FragmentOf<typeof ProductCardFragment>;
  currencyCode: string;
  priority?: boolean;
  /** Selects the `sizes` hint that matches the surrounding layout. */
  layout?: "grid" | "carousel";
}

export function ProductCard({
  product: productProp,
  currencyCode,
  priority,
  layout = "grid",
}: ProductCardProps) {
  const t = useTranslations("Product");
  const product = readFragment(ProductCardFragment, productProp);
  const productImage = product.productAsset?.preview || getProductFallbackImage(product.slug, product.productName);
  const router = useRouter();
  const addProductToCart = useServerFn(addToCart);
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);

  // Determine if the product is a single-variant product
  const isSingleVariant =
    product.priceWithTax.__typename === "SinglePrice" ||
    (product.priceWithTax.__typename === "PriceRange" &&
      product.priceWithTax.min === product.priceWithTax.max);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSingleVariant) {
      // Multi-variant: navigate to product page to select options
      router.push(`/products/${product.slug}`);
      return;
    }

    if (isPending || isAdded) return;

    startTransition(async () => {
      try {
        const result = await addProductToCart({
          data: { variantId: product.productVariantId, quantity: 1 },
        });
        if (result.success) {
          await router.refresh();
          setIsAdded(true);
          triggerCartDrawer();
          toast.success("Added to Bag", {
            description: `${product.productName} has been added to your shopping bag.`,
          });
          setTimeout(() => setIsAdded(false), 2000);
        } else {
          toast.error("Unable to Add", {
            description: result.error || "Please try again later.",
          });
        }
      } catch {
        toast.error("Unable to Add", {
          description: "An unexpected error occurred.",
        });
      }
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-background border border-border/60 hover:border-foreground transition-colors duration-500"
    >
      <div className="aspect-3/4 relative bg-secondary/30 overflow-hidden">
        {productImage ? (
          <Image
            src={productCardImageUrl(productImage, 800)}
            srcSet={productCardSrcSet(productImage)}
            alt={product.productName}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes={
              layout === "carousel"
                ? PRODUCT_CAROUSEL_CARD_SIZES
                : PRODUCT_GRID_CARD_SIZES
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] uppercase tracking-widest font-mono">
            {t("noImage")}
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <WishlistButton
            item={{
              id: product.productId,
              name: product.productName,
              slug: product.slug,
              price: product.priceWithTax.__typename === "SinglePrice" ? product.priceWithTax.value : undefined,
              minPrice: product.priceWithTax.__typename === "PriceRange" ? product.priceWithTax.min : undefined,
              maxPrice: product.priceWithTax.__typename === "PriceRange" ? product.priceWithTax.max : undefined,
              currencyCode,
              previewImage: productImage,
            }}
          />
        </div>

        {/* Add to Cart / Select Options hover button */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isPending}
            className={cn(
              "w-full py-2.5 backdrop-blur-md text-[9px] font-mono font-medium uppercase tracking-[0.25em] text-center border transition-all duration-200 flex items-center justify-center gap-2",
              isAdded
                ? "bg-emerald-600/90 text-white border-emerald-400/40"
                : isPending
                  ? "bg-black/70 text-white/70 border-white/10 cursor-wait"
                  : "bg-black/85 text-white border-white/20 hover:bg-black/95 hover:border-white/40 cursor-pointer"
            )}
          >
            {isAdded ? (
              <>
                <Check className="size-3.5" />
                <span>Added to Bag</span>
              </>
            ) : isPending ? (
              <>
                <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Adding…</span>
              </>
            ) : isSingleVariant ? (
              <>
                <ShoppingBag className="size-3.5 stroke-[1.75]" />
                <span>Add to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="size-3.5 stroke-[1.75]" />
                <span>Select Options</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-1.5 border-t border-border/40">
        <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          Atelier Commission
        </p>
        <h3 className="font-serif text-sm sm:text-base font-normal tracking-tight text-foreground group-hover:underline underline-offset-4 line-clamp-1">
          {product.productName}
        </h3>

        <div className="font-serif text-sm sm:text-base font-light text-foreground/90">
          {product.priceWithTax.__typename === "PriceRange" ? (
            product.priceWithTax.min !== product.priceWithTax.max ? (
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-mono font-normal text-muted-foreground">
                  {t("from")}
                </span>
                <Price
                  value={product.priceWithTax.min}
                  currencyCode={currencyCode}
                />
              </div>
            ) : (
              <Price
                value={product.priceWithTax.min}
                currencyCode={currencyCode}
              />
            )
          ) : product.priceWithTax.__typename === "SinglePrice" ? (
            <Price
              value={product.priceWithTax.value}
              currencyCode={currencyCode}
            />
          ) : null}
        </div>
      </div>
    </Link>
  );
}
