import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/platform/tanstack/navigation";
import { useCheckout } from "../checkout-provider";
import { setShippingAddress, createCustomerAddress } from "../actions";
import { useTranslations } from "@/platform/i18n/paraglide";
import { useServerFn } from "@tanstack/react-start";
import { AddressFormFields, type AddressFormData } from "./address-form-fields";

interface ShippingAddressStepProps {
	onComplete: () => void;
}

export default function ShippingAddressStep({ onComplete }: ShippingAddressStepProps) {
	const t = useTranslations("Checkout");
	const router = useRouter();
	const { addresses, countries, order, isGuest } = useCheckout();
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
		if (order.shippingAddress) {
			const matchingAddress = addresses.find(
				(a) =>
					a.streetLine1 === order.shippingAddress?.streetLine1 &&
					a.postalCode === order.shippingAddress?.postalCode,
			);
			if (matchingAddress) return matchingAddress.id;
		}
		const defaultAddress = addresses.find((a) => a.defaultShippingAddress);
		return defaultAddress?.id || null;
	});
	const [dialogOpen, setDialogOpen] = useState(addresses.length === 0 && !isGuest);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [useSameForBilling, setUseSameForBilling] = useState(true);
	const saveShippingAddress = useServerFn(setShippingAddress);
	const saveCustomerAddress = useServerFn(createCustomerAddress);

	const getDefaultFormValues = (): Partial<AddressFormData> => {
		const customerFullName = order.customer
			? `${order.customer.firstName} ${order.customer.lastName}`.trim()
			: "";

		if (isGuest && order.shippingAddress?.streetLine1) {
			return {
				fullName: order.shippingAddress.fullName || customerFullName,
				streetLine1: order.shippingAddress.streetLine1 || "",
				streetLine2: order.shippingAddress.streetLine2 || "",
				city: order.shippingAddress.city || "",
				province: order.shippingAddress.province || "",
				postalCode: order.shippingAddress.postalCode || "",
				countryCode:
					countries.find((c) => c.name === order.shippingAddress?.country)?.code ||
					countries[0]?.code ||
					"US",
				phoneNumber:
					order.shippingAddress.phoneNumber ||
					order.customer?.phoneNumber ||
					"",
				company: order.shippingAddress.company || "",
			};
		}
		return {
			fullName: customerFullName,
			countryCode: countries[0]?.code || "US",
			phoneNumber: order.customer?.phoneNumber || "",
		};
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
		watch,
	} = useForm<AddressFormData>({
		defaultValues: getDefaultFormValues(),
	});

	const handleSelectExistingAddress = async () => {
		if (!selectedAddressId) return;

		setLoading(true);
		try {
			const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
			if (!selectedAddress) return;

			await saveShippingAddress({
				data: {
					shippingAddress: {
						fullName: selectedAddress.fullName || "",
						company: selectedAddress.company || "",
						streetLine1: selectedAddress.streetLine1,
						streetLine2: selectedAddress.streetLine2 || "",
						city: selectedAddress.city || "",
						province: selectedAddress.province || "",
						postalCode: selectedAddress.postalCode || "",
						countryCode: selectedAddress.country.code,
						phoneNumber: selectedAddress.phoneNumber || "",
					},
					useSameForBilling,
				},
			});

			await router.refresh();
			onComplete();
		} catch (error) {
			console.error("Error setting address:", error);
		} finally {
			setLoading(false);
		}
	};

	const onSaveNewAddress = async (data: AddressFormData) => {
		setSaving(true);
		try {
			const newAddress = await saveCustomerAddress({ data });
			setDialogOpen(false);
			reset();
			await router.refresh();
			setSelectedAddressId(newAddress.id);
		} catch (error) {
			console.error("Error creating address:", error);
		} finally {
			setSaving(false);
		}
	};

	const onSubmitGuestAddress = async (data: AddressFormData) => {
		setLoading(true);
		try {
			await saveShippingAddress({
				data: { shippingAddress: data, useSameForBilling },
			});
			await router.refresh();
			onComplete();
		} catch (error) {
			console.error("Error setting address:", error);
		} finally {
			setLoading(false);
		}
	};

	if (isGuest) {
		return (
			<div className="space-y-6">
				<form onSubmit={handleSubmit(onSubmitGuestAddress)} className="space-y-4">
					<AddressFormFields
						register={register}
						control={control}
						errors={errors}
						watch={watch}
						countries={countries}
						disabled={loading}
						idPrefix="guest"
						t={t}
					/>

					<div className="flex items-center space-x-2 pt-2">
						<Checkbox
							id="same-billing-guest"
							checked={useSameForBilling}
							onCheckedChange={(checked) => setUseSameForBilling(checked === true)}
						/>
						<label
							htmlFor="same-billing-guest"
							className="text-sm font-medium leading-none cursor-pointer select-none text-muted-foreground hover:text-foreground"
						>
							{t("useSameForBilling")}
						</label>
					</div>

					<Button
						type="submit"
						disabled={loading}
						className="w-full h-11 uppercase tracking-widest text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:opacity-90"
					>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{t("continue")}
					</Button>
				</form>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{addresses.length > 0 && (
				<div className="space-y-4">
					<h3 className="font-serif text-lg font-medium">{t("selectSavedAddress")}</h3>
					<RadioGroup
						value={selectedAddressId || ""}
						onValueChange={setSelectedAddressId}
						className="space-y-3"
					>
						{addresses.map((address) => {
							const isSelected = selectedAddressId === address.id;
							return (
								<div key={address.id} className="relative">
									<Label
										htmlFor={address.id}
										className={`block p-4 rounded-none border transition-colors cursor-pointer ${
											isSelected
												? "border-primary bg-primary/[0.02]"
												: "border-border/70 hover:border-border"
										}`}
									>
										<div className="flex items-start gap-3">
											<RadioGroupItem
												value={address.id}
												id={address.id}
												className="mt-0.5"
											/>
											<div className="text-xs space-y-1">
												<p className="font-semibold text-foreground text-sm">
													{address.fullName}
												</p>
												{address.company && (
													<p className="text-muted-foreground">{address.company}</p>
												)}
												<p className="text-muted-foreground">
													{address.streetLine1}
													{address.streetLine2 && `, ${address.streetLine2}`}
												</p>
												<p className="text-muted-foreground">
													{address.city}, {address.province} {address.postalCode}
												</p>
												<p className="font-mono text-[11px] text-muted-foreground/80">
													{address.country.name} • {address.phoneNumber}
												</p>
											</div>
										</div>
									</Label>
								</div>
							);
						})}
					</RadioGroup>

					<div className="flex items-center space-x-2 pt-1">
						<Checkbox
							id="same-billing"
							checked={useSameForBilling}
							onCheckedChange={(checked) => setUseSameForBilling(checked === true)}
						/>
						<label
							htmlFor="same-billing"
							className="text-sm font-medium leading-none cursor-pointer select-none text-muted-foreground hover:text-foreground"
						>
							{t("useSameForBilling")}
						</label>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 pt-2">
						<Button
							onClick={handleSelectExistingAddress}
							disabled={!selectedAddressId || loading}
							className="flex-1 h-11 uppercase tracking-widest text-xs font-semibold rounded-none bg-primary text-primary-foreground hover:opacity-90"
						>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{t("continueWithSelected")}
						</Button>

						<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
							<DialogTrigger
								render={
									<Button
										type="button"
										variant="outline"
										className="h-11 uppercase tracking-widest text-xs rounded-none border-border"
									/>
								}
							>
								{t("addNewAddress")}
							</DialogTrigger>
							<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border-border/80">
								<form onSubmit={handleSubmit(onSaveNewAddress)} className="space-y-4">
									<DialogHeader>
										<DialogTitle className="font-serif text-2xl font-light">
											{t("addNewAddress")}
										</DialogTitle>
										<DialogDescription className="text-xs text-muted-foreground">
											{t("addNewAddressDescription")}
										</DialogDescription>
									</DialogHeader>

									<AddressFormFields
										register={register}
										control={control}
										errors={errors}
										watch={watch}
										countries={countries}
										disabled={saving}
										idPrefix="modal-new"
										t={t}
									/>

									<DialogFooter className="gap-2 sm:gap-0 pt-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => setDialogOpen(false)}
											disabled={saving}
											className="rounded-none text-xs uppercase"
										>
											{t("cancel")}
										</Button>
										<Button
											type="submit"
											disabled={saving}
											className="rounded-none text-xs uppercase font-medium bg-primary text-primary-foreground"
										>
											{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
											{t("saveAddress")}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			)}

			{addresses.length === 0 && (
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger
						render={
							<Button
								type="button"
								className="w-full h-11 uppercase tracking-widest text-xs rounded-none"
							/>
						}
					>
						{t("addShippingAddress")}
					</DialogTrigger>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border-border/80">
						<form onSubmit={handleSubmit(onSaveNewAddress)} className="space-y-4">
							<DialogHeader>
								<DialogTitle className="font-serif text-2xl font-light">
									{t("addShippingAddress")}
								</DialogTitle>
								<DialogDescription className="text-xs text-muted-foreground">
									{t("addShippingAddressDescription")}
								</DialogDescription>
							</DialogHeader>

							<AddressFormFields
								register={register}
								control={control}
								errors={errors}
								watch={watch}
								countries={countries}
								disabled={saving}
								idPrefix="modal-first"
								t={t}
							/>

							<DialogFooter className="gap-2 sm:gap-0 pt-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setDialogOpen(false)}
									disabled={saving}
									className="rounded-none text-xs uppercase"
								>
									{t("cancel")}
								</Button>
								<Button
									type="submit"
									disabled={saving}
									className="rounded-none text-xs uppercase font-medium bg-primary text-primary-foreground"
								>
									{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									{t("saveAddress")}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
