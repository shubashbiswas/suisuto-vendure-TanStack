import { useState } from "react";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ContactStep from "./steps/contact-step";
import ShippingAddressStep from "./steps/shipping-address-step";
import DeliveryStep from "./steps/delivery-step";
import PaymentStep from "./steps/payment-step";
import ReviewStep from "./steps/review-step";
import OrderSummary from "./order-summary";
import { useCheckout } from "./checkout-provider";
import { useTranslations } from "@/platform/i18n/paraglide";

type CheckoutStep = "contact" | "shipping" | "delivery" | "payment" | "review";

export default function CheckoutFlow() {
	const t = useTranslations("Checkout");
	const { order, isGuest } = useCheckout();

	const getStepOrder = (): CheckoutStep[] => {
		if (isGuest) {
			return ["contact", "shipping", "delivery", "payment", "review"];
		}
		return ["shipping", "delivery", "payment", "review"];
	};

	const stepOrder = getStepOrder();

	const getInitialState = () => {
		const completed = new Set<CheckoutStep>();
		let current: CheckoutStep = stepOrder[0];

		if (isGuest) {
			if (order.customer?.emailAddress) {
				completed.add("contact");
				current = "shipping";
			}
		}

		if (order.shippingAddress?.streetLine1 && order.shippingAddress?.country) {
			if (!isGuest || completed.has("contact")) {
				completed.add("shipping");
				current = "delivery";
			}
		}

		if (order.shippingLines && order.shippingLines.length > 0) {
			if (completed.has("shipping")) {
				completed.add("delivery");
				current = "payment";
			}
		}

		return { completed, current };
	};

	const initialState = getInitialState();
	const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialState.current);
	const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(initialState.completed);

	const handleStepComplete = (step: CheckoutStep) => {
		setCompletedSteps((prev) => new Set([...prev, step]));

		const currentIndex = stepOrder.indexOf(step);
		if (currentIndex < stepOrder.length - 1) {
			setCurrentStep(stepOrder[currentIndex + 1]);
		}
	};

	const canAccessStep = (step: CheckoutStep): boolean => {
		const stepIndex = stepOrder.indexOf(step);
		if (stepIndex === 0) return true;
		const previousStep = stepOrder[stepIndex - 1];
		return completedSteps.has(previousStep);
	};

	const getStepNumber = (step: CheckoutStep): number => {
		return stepOrder.indexOf(step) + 1;
	};

	const stepLabels: Record<CheckoutStep, string> = {
		contact: t("steps.contact"),
		shipping: t("steps.address"),
		delivery: t("steps.delivery"),
		payment: t("steps.payment"),
		review: t("steps.review"),
	};

	return (
		<div className="grid lg:grid-cols-3 gap-8">
			<div className="lg:col-span-2">
				{/* Step Progress Indicator */}
				<div className="mb-8 hidden sm:block">
					<div className="flex items-center justify-between">
						{stepOrder.map((step, index) => (
							<div key={step} className="flex items-center flex-1 last:flex-none">
								<div className="flex flex-col items-center gap-1.5">
									<div
										className={`flex items-center justify-center size-8 rounded-full text-xs font-mono font-medium transition-all duration-300 ${
											completedSteps.has(step)
												? "bg-emerald-600 dark:bg-emerald-500 text-white"
												: currentStep === step
												? "bg-primary text-primary-foreground ring-4 ring-primary/15 font-semibold"
												: "bg-muted text-muted-foreground border border-border"
										}`}
									>
										{completedSteps.has(step) ? (
											<Check className="size-3.5 stroke-[2.5]" />
										) : (
											getStepNumber(step)
										)}
									</div>
									<span
										className={`text-[11px] font-sans uppercase tracking-wider whitespace-nowrap ${
											completedSteps.has(step)
												? "text-foreground font-medium"
												: currentStep === step
												? "text-primary font-semibold"
												: "text-muted-foreground"
										}`}
									>
										{stepLabels[step]}
									</span>
								</div>
								{index < stepOrder.length - 1 && (
									<div className="flex-1 mx-3 mb-5">
										<div
											className={`h-px w-full transition-colors duration-300 ${
												completedSteps.has(step) ? "bg-emerald-600/70" : "bg-border/80"
											}`}
										/>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				<Accordion
					value={[currentStep]}
					onValueChange={(value) => {
						const step = value[0] as CheckoutStep | undefined;
						if (step && canAccessStep(step)) {
							setCurrentStep(step);
						}
					}}
					className="space-y-4"
				>
					{isGuest && (
						<AccordionItem
							value="contact"
							className="border border-border/70 rounded-none bg-card px-6"
						>
							<AccordionTrigger className="hover:no-underline py-5">
								<div className="flex items-center gap-3">
									<div
										className={`flex items-center justify-center size-7 rounded-full text-xs font-mono transition-colors ${
											completedSteps.has("contact")
												? "bg-emerald-600 dark:bg-emerald-500 text-white"
												: currentStep === "contact"
												? "bg-primary text-primary-foreground font-semibold"
												: "bg-muted text-muted-foreground"
										}`}
									>
										{completedSteps.has("contact") ? (
											<Check className="size-3.5 stroke-[2.5]" />
										) : (
											getStepNumber("contact")
										)}
									</div>
									<span className="font-serif text-lg font-medium tracking-tight">
										{t("contactInformation")}
									</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="pt-2 pb-6">
								<ContactStep onComplete={() => handleStepComplete("contact")} />
							</AccordionContent>
						</AccordionItem>
					)}

					<AccordionItem
						value="shipping"
						className="border border-border/70 rounded-none bg-card px-6"
						disabled={!canAccessStep("shipping")}
					>
						<AccordionTrigger
							className="hover:no-underline py-5"
							disabled={!canAccessStep("shipping")}
						>
							<div className="flex items-center gap-3">
								<div
									className={`flex items-center justify-center size-7 rounded-full text-xs font-mono transition-colors ${
										completedSteps.has("shipping")
											? "bg-emerald-600 dark:bg-emerald-500 text-white"
											: currentStep === "shipping"
											? "bg-primary text-primary-foreground font-semibold"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{completedSteps.has("shipping") ? (
										<Check className="size-3.5 stroke-[2.5]" />
									) : (
										getStepNumber("shipping")
									)}
								</div>
								<span className="font-serif text-lg font-medium tracking-tight">
									{t("shippingAddress")}
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="pt-2 pb-6">
							<ShippingAddressStep onComplete={() => handleStepComplete("shipping")} />
						</AccordionContent>
					</AccordionItem>

					<AccordionItem
						value="delivery"
						className="border border-border/70 rounded-none bg-card px-6"
						disabled={!canAccessStep("delivery")}
					>
						<AccordionTrigger
							className="hover:no-underline py-5"
							disabled={!canAccessStep("delivery")}
						>
							<div className="flex items-center gap-3">
								<div
									className={`flex items-center justify-center size-7 rounded-full text-xs font-mono transition-colors ${
										completedSteps.has("delivery")
											? "bg-emerald-600 dark:bg-emerald-500 text-white"
											: currentStep === "delivery"
											? "bg-primary text-primary-foreground font-semibold"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{completedSteps.has("delivery") ? (
										<Check className="size-3.5 stroke-[2.5]" />
									) : (
										getStepNumber("delivery")
									)}
								</div>
								<span className="font-serif text-lg font-medium tracking-tight">
									{t("deliveryMethod")}
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="pt-2 pb-6">
							<DeliveryStep onComplete={() => handleStepComplete("delivery")} />
						</AccordionContent>
					</AccordionItem>

					<AccordionItem
						value="payment"
						className="border border-border/70 rounded-none bg-card px-6"
						disabled={!canAccessStep("payment")}
					>
						<AccordionTrigger
							className="hover:no-underline py-5"
							disabled={!canAccessStep("payment")}
						>
							<div className="flex items-center gap-3">
								<div
									className={`flex items-center justify-center size-7 rounded-full text-xs font-mono transition-colors ${
										completedSteps.has("payment")
											? "bg-emerald-600 dark:bg-emerald-500 text-white"
											: currentStep === "payment"
											? "bg-primary text-primary-foreground font-semibold"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{completedSteps.has("payment") ? (
										<Check className="size-3.5 stroke-[2.5]" />
									) : (
										getStepNumber("payment")
									)}
								</div>
								<span className="font-serif text-lg font-medium tracking-tight">
									{t("paymentMethod")}
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="pt-2 pb-6">
							<PaymentStep onComplete={() => handleStepComplete("payment")} />
						</AccordionContent>
					</AccordionItem>

					<AccordionItem
						value="review"
						className="border border-border/70 rounded-none bg-card px-6"
						disabled={!canAccessStep("review")}
					>
						<AccordionTrigger
							className="hover:no-underline py-5"
							disabled={!canAccessStep("review")}
						>
							<div className="flex items-center gap-3">
								<div
									className={`flex items-center justify-center size-7 rounded-full text-xs font-mono transition-colors ${
										currentStep === "review"
											? "bg-primary text-primary-foreground font-semibold"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{getStepNumber("review")}
								</div>
								<span className="font-serif text-lg font-medium tracking-tight">
									{t("reviewAndPlaceOrder")}
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="pt-2 pb-6">
							<ReviewStep onEditStep={setCurrentStep} />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>

			<div className="lg:col-span-1">
				<OrderSummary />
			</div>
		</div>
	);
}
