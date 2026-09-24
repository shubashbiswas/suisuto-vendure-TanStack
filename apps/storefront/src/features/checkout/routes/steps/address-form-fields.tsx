import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormWatch } from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/country-select";

export interface CheckoutCountry {
	id?: string;
	code: string;
	name: string;
}

export interface AddressFormData {
	fullName: string;
	streetLine1: string;
	streetLine2?: string;
	city: string;
	province: string;
	postalCode: string;
	countryCode: string;
	phoneNumber: string;
	company?: string;
	recipientKycId?: string;
}

interface AddressFormFieldsProps {
	register: UseFormRegister<AddressFormData>;
	control: Control<AddressFormData>;
	errors: FieldErrors<AddressFormData>;
	watch: UseFormWatch<AddressFormData>;
	countries: CheckoutCountry[];
	disabled?: boolean;
	idPrefix?: string;
	t: (key: string) => string;
}

export function AddressFormFields({
	register,
	control,
	errors,
	watch,
	countries,
	disabled = false,
	idPrefix = "addr",
	t,
}: AddressFormFieldsProps) {
	const currentCountry = watch("countryCode");

	return (
		<FieldGroup>
			<div className="grid grid-cols-2 gap-4">
				<Field className="col-span-2">
					<FieldLabel htmlFor={`${idPrefix}-fullName`}>{t("fullName")}</FieldLabel>
					<Input
						id={`${idPrefix}-fullName`}
						disabled={disabled}
						placeholder="Jane Doe"
						{...register("fullName", { required: t("fullNameRequired") })}
					/>
					<FieldError>{errors.fullName?.message}</FieldError>
				</Field>

				<Field className="col-span-2">
					<FieldLabel htmlFor={`${idPrefix}-company`}>{t("company")}</FieldLabel>
					<Input
						id={`${idPrefix}-company`}
						disabled={disabled}
						placeholder="Optional"
						{...register("company")}
					/>
				</Field>

				<Field className="col-span-2">
					<FieldLabel htmlFor={`${idPrefix}-streetLine1`}>{t("streetAddress")}</FieldLabel>
					<Input
						id={`${idPrefix}-streetLine1`}
						disabled={disabled}
						placeholder="123 Luxury Way"
						{...register("streetLine1", { required: t("streetRequired") })}
					/>
					<FieldError>{errors.streetLine1?.message}</FieldError>
				</Field>

				<Field className="col-span-2">
					<FieldLabel htmlFor={`${idPrefix}-streetLine2`}>{t("apartment")}</FieldLabel>
					<Input
						id={`${idPrefix}-streetLine2`}
						disabled={disabled}
						placeholder="Suite, apartment, unit, etc."
						{...register("streetLine2")}
					/>
				</Field>

				<Field>
					<FieldLabel htmlFor={`${idPrefix}-city`}>{t("city")}</FieldLabel>
					<Input
						id={`${idPrefix}-city`}
						disabled={disabled}
						{...register("city", { required: t("cityRequired") })}
					/>
					<FieldError>{errors.city?.message}</FieldError>
				</Field>

				<Field>
					<FieldLabel htmlFor={`${idPrefix}-province`}>{t("stateProvince")}</FieldLabel>
					<Input
						id={`${idPrefix}-province`}
						disabled={disabled}
						{...register("province")}
					/>
					<FieldError>{errors.province?.message}</FieldError>
				</Field>

				<Field>
					<FieldLabel htmlFor={`${idPrefix}-postalCode`}>{t("postalCode")}</FieldLabel>
					<Input
						id={`${idPrefix}-postalCode`}
						disabled={disabled}
						{...register("postalCode", { required: t("postalCodeRequired") })}
					/>
					<FieldError>{errors.postalCode?.message}</FieldError>
				</Field>

				<Field>
					<FieldLabel htmlFor={`${idPrefix}-countryCode`}>{t("country")}</FieldLabel>
					<Controller
						name="countryCode"
						control={control}
						rules={{ required: t("countryRequired") }}
						render={({ field }) => (
							<CountrySelect
								countries={countries}
								value={field.value}
								onValueChange={field.onChange}
								disabled={disabled}
							/>
						)}
					/>
					<FieldError>{errors.countryCode?.message}</FieldError>
				</Field>

				<Field className="col-span-2">
					<FieldLabel htmlFor={`${idPrefix}-phoneNumber`}>{t("phoneNumber")}</FieldLabel>
					<Input
						id={`${idPrefix}-phoneNumber`}
						type="tel"
						disabled={disabled}
						placeholder="+1 (555) 000-0000"
						{...register("phoneNumber", { required: t("phoneRequired") })}
					/>
					<FieldError>{errors.phoneNumber?.message}</FieldError>
				</Field>

				{currentCountry === "IN" && (
					<Field className="col-span-2 p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-1">
						<FieldLabel
							htmlFor={`${idPrefix}-recipientKycId`}
							className="text-amber-900 dark:text-amber-200 font-semibold text-xs flex items-center gap-1.5"
						>
							<span>🇮🇳 Indian Customs Mandatory KYC</span>
						</FieldLabel>
						<Input
							id={`${idPrefix}-recipientKycId`}
							disabled={disabled}
							placeholder="Aadhaar / PAN / Passport ID number"
							{...register("recipientKycId")}
							className="bg-background text-xs"
						/>
						<p className="text-[11px] text-muted-foreground">
							Required by Government of India import regulations for customs clearance of cross-border parcels.
						</p>
					</Field>
				)}
			</div>
		</FieldGroup>
	);
}
