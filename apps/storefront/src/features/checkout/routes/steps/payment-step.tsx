import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, ShieldCheck, Lock } from "lucide-react";
import { useCheckout } from "../checkout-provider";
import { useTranslations } from "@/platform/i18n/paraglide";

interface PaymentStepProps {
	onComplete: () => void;
}

export default function PaymentStep({ onComplete }: PaymentStepProps) {
	const t = useTranslations("Checkout");
	const { paymentMethods, selectedPaymentMethodCode, setSelectedPaymentMethodCode } =
		useCheckout();

	const handleContinue = () => {
		if (!selectedPaymentMethodCode) return;
		onComplete();
	};

	if (paymentMethods.length === 0) {
		return (
			<div className="text-center py-12 border border-dashed border-border/80 p-6 space-y-2">
				<CreditCard className="size-8 mx-auto text-muted-foreground stroke-1" />
				<p className="text-sm text-muted-foreground font-serif">
					{t("noPaymentMethods")}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h3 className="font-serif text-lg font-medium">{t("selectPaymentMethod")}</h3>
				<p className="text-xs text-muted-foreground">
					All transactions are secured with end-to-end 256-bit atelier bank encryption.
				</p>
			</div>

			<RadioGroup
				value={selectedPaymentMethodCode || ""}
				onValueChange={setSelectedPaymentMethodCode}
				className="space-y-3"
			>
				{paymentMethods.map((method) => {
					const isSelected = selectedPaymentMethodCode === method.code;

					return (
						<Label
							key={method.code}
							htmlFor={method.code}
							className={`block p-4.5 rounded-none border transition-all cursor-pointer ${
								isSelected
									? "border-primary bg-primary/[0.02] shadow-sm"
									: "border-border/70 hover:border-border"
							}`}
						>
							<div className="flex items-center gap-3.5">
								<RadioGroupItem value={method.code} id={method.code} />
								<div className="size-9 rounded-full bg-secondary/60 flex items-center justify-center shrink-0 text-foreground">
									<CreditCard className="size-4" />
								</div>
								<div className="flex-1 min-w-0 space-y-0.5">
									<p className="font-serif text-base font-semibold tracking-tight text-foreground truncate">
										{method.name}
									</p>
									{method.description ? (
										// biome-ignore lint/security/noDangerouslySetInnerHtml: renders trusted HTML from the Vendure API
										<div
											className="text-xs text-muted-foreground truncate [&_p]:truncate"
											dangerouslySetInnerHTML={{ __html: method.description }}
										/>
									) : (
										<p className="text-xs text-muted-foreground">
											Secure checkout via authorized payment gateway
										</p>
									)}
								</div>
								<div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-muted-foreground/80">
									<ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
									<span>Verified</span>
								</div>
							</div>
						</Label>
					);
				})}
			</RadioGroup>

			<div className="p-3.5 bg-secondary/30 border border-border/50 text-xs text-muted-foreground flex items-center gap-2">
				<Lock className="size-4 shrink-0 text-foreground" />
				<span>Payment authorization occurs securely on the next step prior to order placement.</span>
			</div>

			<Button
				onClick={handleContinue}
				disabled={!selectedPaymentMethodCode}
				className="w-full h-11 uppercase tracking-widest text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:opacity-90"
			>
				{t("continueToReview")}
			</Button>
		</div>
	);
}
