import Image from '@/components/storefront-image';
import { Link } from '@tanstack/react-router';
import {Button} from '@/components/ui/button';
import {Minus, Plus, X, Sparkles, ArrowRight} from 'lucide-react';
import {Price} from '@/features/pricing/price';
import {removeFromCart, adjustQuantity, type CartActionResult} from './actions';
import {toast} from 'sonner';
import {useTranslations} from '@/platform/i18n/paraglide';
import {useServerFn} from '@tanstack/react-start';
import {useRouter} from '@/platform/tanstack/navigation';
import {useTransition} from 'react';
import { getProductFallbackImage } from '@/features/products/product-fallback';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    lines: Array<{
        id: string;
        quantity: number;
        unitPriceWithTax: number;
        linePriceWithTax: number;
        productVariant: {
            id: string;
            name: string;
            sku: string;
            product: {
                name: string;
                slug: string;
                featuredAsset?: {
                    preview: string;
                } | null;
            };
        };
    }>;
};

export function CartItems({activeOrder}: { activeOrder: ActiveOrder | null }) {
    const t = useTranslations('Cart');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const adjust = useServerFn(adjustQuantity);
    const remove = useServerFn(removeFromCart);
    const run = (mutation: () => Promise<CartActionResult>) => startTransition(async () => {
        const result = await mutation();
        await router.refresh();
        if (!result.success) toast.error(result.message);
    });
    if (!activeOrder || activeOrder.lines.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center max-w-xl">
                <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground">Bag (0)</span>
                <h1 className="text-3xl sm:text-4xl font-serif font-light mt-3 mb-4 tracking-tight">Your Atelier Bag is Empty</h1>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    {t('emptyMessage')}
                </p>
                <Button 
                    render={<Link to="/" />} 
                    nativeButton={false}
                    className="h-12 px-8 uppercase tracking-widest text-xs font-medium rounded-none bg-primary text-primary-foreground hover:opacity-90"
                >
                    Discover The Editions <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </Button>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 space-y-4">
            <div className="p-4 border border-border/80 bg-secondary/30 flex items-center gap-3 text-xs tracking-wide">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <div>
                    <span className="font-serif tracking-wider uppercase font-semibold text-foreground">Complimentary Packaging & Certificate:</span>
                    <span className="text-muted-foreground ml-1.5">
                        Each commission arrives hand-wrapped in climate-neutral archival boxes and accompanied by a numbered certificate of authenticity.
                    </span>
                </div>
            </div>

            <div className="divide-y divide-border border border-border bg-card">
                {activeOrder.lines.map((line) => (
                <div
                    key={line.id}
                    className="flex flex-col sm:flex-row gap-5 p-5 transition-colors duration-200 hover:bg-muted/10"
                >
                    {(() => {
                        const preview = line.productVariant.product.featuredAsset?.preview ||
                            getProductFallbackImage(line.productVariant.product.slug, line.productVariant.name);
                        return (
                            <Link
                                to="/products/$slug"
                                params={{slug: line.productVariant.product.slug}}
                                className="shrink-0 relative aspect-3/4 w-24 sm:w-28 overflow-hidden bg-muted"
                            >
                                <Image
                                    src={preview}
                                    alt={line.productVariant.name}
                                    width={140}
                                    height={187}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </Link>
                        );
                    })()}

                    <div className="grow min-w-0 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <Link
                                        to="/products/$slug"
                                        params={{slug: line.productVariant.product.slug}}
                                        className="font-serif text-lg sm:text-xl font-medium tracking-tight hover:underline line-clamp-1 block"
                                    >
                                        {line.productVariant.product.name}
                                    </Link>
                                    {line.productVariant.name !== line.productVariant.product.name && (
                                        <p className="text-xs tracking-wider uppercase text-muted-foreground mt-0.5">
                                            Edition: {line.productVariant.name}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground"
                                    disabled={isPending}
                                    onClick={() => run(() => remove({data: {lineId: line.id}}))}
                                >
                                    <X className="h-4 w-4"/>
                                    <span className="sr-only">Remove</span>
                                </Button>
                            </div>
                            <p className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground/70 mt-1">
                                {t('sku', {sku: line.productVariant.sku})}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-3 border-t border-border/40">
                            <div className="flex items-center border border-border bg-background">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none hover:bg-muted"
                                    disabled={isPending || line.quantity <= 1}
                                    onClick={() => run(() => adjust({data: {lineId: line.id, quantity: Math.max(1, line.quantity - 1)}}))}
                                >
                                    <Minus className="h-3 w-3"/>
                                </Button>

                                <span className="w-9 text-center font-mono text-xs tabular-nums">{line.quantity}</span>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none hover:bg-muted"
                                    disabled={isPending}
                                    onClick={() => run(() => adjust({data: {lineId: line.id, quantity: line.quantity + 1}}))}
                                >
                                    <Plus className="h-3 w-3"/>
                                </Button>
                            </div>

                            <div className="text-right">
                                <p className="font-serif text-lg font-medium tracking-tight">
                                    <Price value={line.linePriceWithTax} currencyCode={activeOrder.currencyCode}/>
                                </p>
                                {line.quantity > 1 && (
                                    <p className="text-[11px] text-muted-foreground">
                                        <Price value={line.unitPriceWithTax} currencyCode={activeOrder.currencyCode}/> each
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}
