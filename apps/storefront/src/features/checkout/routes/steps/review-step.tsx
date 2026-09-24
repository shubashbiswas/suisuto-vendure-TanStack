import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Truck, CreditCard, Edit, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { useCheckout } from "../checkout-provider";
import { placeOrder as placeOrderAction } from "../actions";
import { Price } from "@/features/pricing/price";
import { useTranslations } from "@/platform/i18n/paraglide";
import { useServerFn } from "@tanstack/react-start";

interface ReviewStepProps {
	onEditStep: (step: "contact" | "shipping" | "delivery" | "payment") => void;
}

export default function ReviewStep({ onEditStep }: ReviewStepProps) {
	const t = useTranslations("Checkout");
	const { order, paymentMethods, selectedPaymentMethodCode, isGuest } = useCheckout();
	const [loading, setLoading] = useState(false);
	const submitOrder = useServerFn(placeOrderAction);

	const selectedPaymentMethod = paymentMethods.find(
		(method) => method.code === selectedPaymentMethodCode,
	);

	const handlePlaceOrder = async () => {
		if (!selectedPaymentMethodCode) return;

		setLoading(true);
		try {
			await submitOrder({ data: { paymentMethodCode: selectedPaymentMethodCode } });
		} catch (error) {
			console.error("Error placing order:", error);
			setLoading(false);
		}
	};

	const isComplete = Boolean(
		order.shippingAddress &&
		order.shippingLines &&
		order.shippingLines.length > 0 &&
		selectedPaymentMethodCode,
	);

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h3 className="font-serif text-lg font-medium">{t("reviewYourOrder")}</h3>
				<p className="text-xs text-muted-foreground">
					Please inspect your destination, dispatch logistics, and payment authorization before placing your order.
				</p>
			</div>

			<div
				className={`grid grid-cols-1 gap-4 ${
					isGuest ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"
				}`}
			>
				{isGuest && order.customer && (
					<div className="border border-border/70 p-4 space-y-3 bg-card/60 flex flex-col justify-between">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-foreground font-serif font-medium text-sm">
									<Mail className="size-3.5 text-muted-foreground" />
									<span>{t("contact")}</span>
								</div>
								<button
									type="button"
									onClick={() => onEditStep("contact")}
									className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
								>
									<Edit className="size-3" />
									<span>{t("edit")}</span>
								</button>
							</div>
							<div className="text-xs space-y-0.5 text-muted-foreground">
								<p className="font-medium text-foreground">
									{order.customer.firstName} {order.customer.lastName}
								</p>
								<p className="truncate">{order.customer.emailAddress}</p>
								{order.customer.phoneNumber && <p>{order.customer.phoneNumber}</p>}
							</div>
						</div>
					</div>
				)}

				{/* Shipping Address */}
				<div className="border border-border/70 p-4 space-y-3 bg-card/60 flex flex-col justify-between">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-foreground font-serif font-medium text-sm">
								<MapPin className="size-3.5 text-muted-foreground" />
								<span>{t("shippingAddress")}</span>
							</div>
							<button
								type="button"
								onClick={() => onEditStep("shipping")}
								className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
							>
								<Edit className="size-3" />
								<span>{t("edit")}</span>
							</button>
						</div>
						{order.shippingAddress ? (
							<div className="text-xs space-y-0.5 text-muted-foreground">
								<p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
								{order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
								<p>
									{order.shippingAddress.streetLine1}
									{order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
								</p>
								<p>
									{order.shippingAddress.city}, {order.shippingAddress.province}{" "}
									{order.shippingAddress.postalCode}
								</p>
								<p>{order.shippingAddress.country}</p>
							</div>
						) : (
							<p className="text-xs text-muted-foreground">{t("noShippingAddress")}</p>
						)}
					</div>
				</div>

				{/* Delivery Method */}
				<div className="border border-border/70 p-4 space-y-3 bg-card/60 flex flex-col justify-between">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-foreground font-serif font-medium text-sm">
								<Truck className="size-3.5 text-muted-foreground" />
								<span>{t("deliveryMethod")}</span>
							</div>
							<button
								type="button"
								onClick={() => onEditStep("delivery")}
								className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
							>
								<Edit className="size-3" />
								<span>{t("edit")}</span>
							</button>
						</div>
						{order.shippingLines && order.shippingLines.length > 0 ? (
							<div className="text-xs space-y-1">
								<p className="font-medium text-foreground">
									{order.shippingLines[0].shippingMethod.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{order.shippingLines[0].priceWithTax === 0 ? (
										<span className="text-emerald-600 dark:text-emerald-400 font-medium">
											{t("free")} (Complimentary)
										</span>
									) : (
										<Price
											value={order.shippingLines[0].priceWithTax}
											currencyCode={order.currencyCode}
										/>
									)}
								</p>
							</div>
						) : (
							<p className="text-xs text-muted-foreground">{t("noDeliveryMethod")}</p>
						)}
					</div>
				</div>

				{/* Payment Method */}
				<div className="border border-border/70 p-4 space-y-3 bg-card/60 flex flex-col justify-between">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-foreground font-serif font-medium text-sm">
								<CreditCard className="size-3.5 text-muted-foreground" />
								<span>{t("paymentMethod")}</span>
							</div>
							<button
								type="button"
								onClick={() => onEditStep("payment")}
								className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
							>
								<Edit className="size-3" />
								<span>{t("edit")}</span>
							</button>
						</div>
						{selectedPaymentMethod ? (
							<div className="text-xs space-y-1">
								<p className="font-medium text-foreground">{selectedPaymentMethod.name}</p>
								<div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
									<ShieldCheck className="size-3" />
									<span>Authorized Payment Partner</span>
								</div>
							</div>
						) : (
							<p className="text-xs text-muted-foreground">{t("noPaymentMethod")}</p>
						)}
					</div>
				</div>
			</div>

			<div className="space-y-3 pt-2">
				<Button
					onClick={handlePlaceOrder}
					disabled={loading || !isComplete}
					className="w-full h-12 uppercase tracking-widest text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2 group"
				>
					{loading && <Loader2 className="size-4 animate-spin" />}
					<span>{t("placeOrder")}</span>
					<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
				</Button>

				{!isComplete && (
					<p className="text-xs text-destructive text-center font-mono">
						{t("completeAllSteps")}
					</p>
				)}

				<div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground uppercase tracking-widest font-mono">
					<ShieldCheck className="size-3 text-primary" />
					<span>Protected by Suisuto Haute Couture Escrow</span>
				</div>
			</div>
		</div>
	);
}
