import { Link } from '@tanstack/react-router';
import {Button} from '@/components/ui/button';
import {ShieldCheck, ArrowRight} from 'lucide-react';
import {Price} from '@/features/pricing/price';
import {useTranslations} from '@/platform/i18n/paraglide';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    discounts?: Array<{
        description: string;
        amountWithTax: number;
    }> | null;
};

export function OrderSummary({activeOrder}: { activeOrder: ActiveOrder }) {
    const t = useTranslations('Cart');
    return (
        <div className="border border-border bg-card p-6 md:p-7 sticky top-24">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">Financial Overview</span>
            <h2 className="font-serif text-2xl font-light tracking-tight mb-5 pb-3 border-b border-border/60">{t('orderSummary')}</h2>

            <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('subtotal')}</span>
                    <span className="font-medium">
                        <Price value={activeOrder.subTotalWithTax} currencyCode={activeOrder.currencyCode}/>
                    </span>
                </div>
                {activeOrder.discounts && activeOrder.discounts.length > 0 && (
                    activeOrder.discounts.map((discount, index) => (
                            <div key={index} className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                <span>{discount.description}</span>
                                <span className="font-medium">
                                    -<Price value={discount.amountWithTax} currencyCode={activeOrder.currencyCode}/>
                                </span>
                            </div>
                        ))
                )}
                <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('shipping')}</span>
                    <span className="font-medium">
                        {activeOrder.shippingWithTax > 0
                            ? <Price value={activeOrder.shippingWithTax} currencyCode={activeOrder.currencyCode}/>
                            : <span className="text-xs uppercase tracking-wider text-muted-foreground">Calculated at next step</span>}
                    </span>
                </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                    <span className="font-serif text-lg tracking-tight uppercase">{t('total')}</span>
                    <span className="font-serif text-3xl font-medium tracking-tight">
                        <Price value={activeOrder.totalWithTax} currencyCode={activeOrder.currencyCode}/>
                    </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Inclusive of all regional luxury taxes</p>
            </div>

            <Button 
                render={<Link to="/checkout" />} 
                nativeButton={false} 
                className="w-full h-12 uppercase tracking-widest text-xs font-medium rounded-none bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2" 
                size="lg"
            >
                {t('proceedToCheckout')} <ArrowRight className="w-3.5 h-3.5" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Encrypted 256-Bit Atelier Checkout</span>
            </div>

            <Button 
                render={<Link to="/" />} 
                nativeButton={false} 
                variant="outline" 
                className="w-full mt-3 h-10 uppercase tracking-widest text-[11px] rounded-none border-border/80 hover:bg-muted/40"
            >
                {t('continueShopping')}
            </Button>
        </div>
    );
}
