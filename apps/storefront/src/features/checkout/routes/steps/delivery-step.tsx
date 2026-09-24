import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, Sparkles } from "lucide-react";
import { useRouter } from "@/platform/tanstack/navigation";
import { useCheckout } from "../checkout-provider";
import { setShippingMethod as setShippingMethodAction } from "../actions";
import { useTranslations } from "@/platform/i18n/paraglide";
import { useServerFn } from "@tanstack/react-start";
import { Price } from "@/features/pricing/price";

interface DeliveryStepProps {
	onComplete: () => void;
}

export default function DeliveryStep({ onComplete }: DeliveryStepProps) {
	const t = useTranslations("Checkout");
	const router = useRouter();
	const { shippingMethods, order } = useCheckout();
	const [selectedMethodId, setSelectedMethodId] = useState<string | null>(() => {
		if (order.shippingLines && order.shippingLines.length > 0) {
			return order.shippingLines[0].shippingMethod.id;
		}
		return shippingMethods.length === 1 ? shippingMethods[0].id : null;
	});
	const [submitting, setSubmitting] = useState(false);
	const setShippingMethod = useServerFn(setShippingMethodAction);

	const handleContinue = async () => {
		if (!selectedMethodId) return;

		setSubmitting(true);
		try {
			await setShippingMethod({ data: { shippingMethodId: selectedMethodId } });
			await router.refresh();
			onComplete();
		} catch (error) {
			console.error("Error setting shipping method:", error);
		} finally {
			setSubmitting(false);
		}
	};

	if (shippingMethods.length === 0) {
		return (
			<div className="text-center py-12 border border-dashed border-border/80 p-6 space-y-2">
				<Truck className="size-8 mx-auto text-muted-foreground stroke-1" />
				<p className="text-sm text-muted-foreground font-serif">
					{t("noShippingMethods")}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h3 className="font-serif text-lg font-medium">{t("selectShippingMethod")}</h3>
				<p className="text-xs text-muted-foreground">
					Select your preferred artisan delivery tier with insured logistics tracking.
				</p>
			</div>

			<RadioGroup
				value={selectedMethodId || ""}
				onValueChange={setSelectedMethodId}
				className="space-y-3"
			>
				{shippingMethods.map((method) => {
					const isSelected = selectedMethodId === method.id;
					const isFree = method.priceWithTax === 0;

					return (
						<Label
							key={method.id}
							htmlFor={method.id}
							className={`block p-4.5 rounded-none border transition-all cursor-pointer ${
								isSelected
									? "border-primary bg-primary/[0.02] shadow-sm"
									: "border-border/70 hover:border-border"
							}`}
						>
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3.5 flex-1 min-w-0">
									<RadioGroupItem value={method.id} id={method.id} />
									<div className="size-9 rounded-full bg-secondary/60 flex items-center justify-center shrink-0 text-foreground">
										<Truck className="size-4" />
									</div>
									<div className="min-w-0 space-y-0.5">
										<div className="flex items-center gap-2">
											<p className="font-serif text-base font-semibold tracking-tight text-foreground truncate">
												{method.name}
											</p>
											{isFree && (
												<span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
													<Sparkles className="size-2.5" />
													Complimentary
												</span>
											)}
										</div>
										{method.description ? (
											<p className="text-xs text-muted-foreground truncate">
												{method.description}
											</p>
										) : (
											<p className="text-xs text-muted-foreground">
												Insured priority handloom transit & direct doorstep delivery
											</p>
										)}
									</div>
								</div>

								<div className="text-right shrink-0">
									<p className="font-serif text-base font-semibold">
										{isFree ? (
											<span className="text-emerald-600 dark:text-emerald-400">{t("free")}</span>
										) : (
											<Price value={method.priceWithTax} currencyCode={order.currencyCode} />
										)}
									</p>
								</div>
							</div>
						</Label>
					);
				})}
			</RadioGroup>

			<Button
				onClick={handleContinue}
				disabled={!selectedMethodId || submitting}
				className="w-full h-11 uppercase tracking-widest text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2"
			>
				{submitting && <Loader2 className="size-4 animate-spin" />}
				<span>{t("continueToPayment")}</span>
			</Button>
		</div>
	);
}
