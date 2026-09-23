import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Tag} from 'lucide-react';
import {applyPromotionCode, removePromotionCode, type CartActionResult} from './actions';
import {useTranslations} from '@/platform/i18n/paraglide';
import {useServerFn} from '@tanstack/react-start';
import {useRouter} from '@/platform/tanstack/navigation';
import {useState, useTransition} from 'react';

type ActiveOrder = {
    id: string;
    couponCodes?: string[] | null;
};

export function PromotionCode({activeOrder}: { activeOrder: ActiveOrder }) {
    const t = useTranslations('Cart');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const applyCode = useServerFn(applyPromotionCode);
    const removeCode = useServerFn(removePromotionCode);
    const [error, setError] = useState<string | null>(null);
    const submit = (mutation: () => Promise<CartActionResult>) => startTransition(async () => {
        const result = await mutation();
        await router.refresh();
        setError(result.success ? null : result.message);
    });
    return (
        <div className="border border-border bg-card p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-primary"/>
                <span className="font-serif text-base font-medium">{t('promotionCode')}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
                {t('enterDiscountCode')}
            </p>

            {activeOrder.couponCodes && activeOrder.couponCodes.length > 0 ? (
                <div className="space-y-2">
                    {activeOrder.couponCodes.map((code) => (
                        <div key={code}
                             className="flex items-center justify-between p-3 border border-border/80 bg-secondary/40 text-xs">
                            <div className="flex items-center gap-2">
                                <Tag className="h-3.5 w-3.5 text-primary"/>
                                <span className="font-mono tracking-wider font-semibold">{code}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none uppercase tracking-wider"
                                disabled={isPending}
                                onClick={() => submit(() => removeCode({data: {code}}))}
                            >
                                {t('remove')}
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        const code = String(new FormData(event.currentTarget).get('code') ?? '');
                        submit(() => applyCode({data: {code}}));
                    }} className="flex gap-2">
                        <Input
                            type="text"
                            name="code"
                            placeholder={t('enterCode')}
                            className="flex-1 h-10 rounded-none text-xs uppercase tracking-wider font-mono bg-background"
                            required
                        />
                        <Button 
                            type="submit" 
                            disabled={isPending}
                            className="h-10 px-5 uppercase tracking-widest text-xs rounded-none bg-primary text-primary-foreground hover:opacity-90"
                        >
                            {t('apply')}
                        </Button>
                    </form>
                    {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
                </div>
            )}
        </div>
    );
}
