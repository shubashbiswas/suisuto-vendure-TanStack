import {Cart} from "@/features/cart/routes/cart";
import {useTranslations} from '@/platform/i18n/paraglide';
import type {ResultOf} from '@/platform/vendure/graphql';
import type {GetActiveOrderQuery} from '@/features/cart/graphql';

export default function CartPage({activeOrder}: {activeOrder: ResultOf<typeof GetActiveOrderQuery>['activeOrder']}) {
    const t = useTranslations('Cart');

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-6xl">
            <div className="border-b border-border/60 pb-6 mb-8 flex items-baseline justify-between">
                <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Order Selection</span>
                    <h1 className="text-3xl md:text-5xl font-serif font-light tracking-tight mt-1">{t('title')}</h1>
                </div>
                {activeOrder && activeOrder.lines.length > 0 && (
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {activeOrder.lines.reduce((sum, l) => sum + l.quantity, 0)} Items
                    </span>
                )}
            </div>

            <Cart activeOrder={activeOrder}/>
        </div>
    );
}

