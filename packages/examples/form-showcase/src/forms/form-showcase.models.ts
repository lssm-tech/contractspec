import type {
	AddressFormValue,
	PhoneFormValue,
} from '@contractspec/lib.contracts-spec/forms';
import { fromZod } from '@contractspec/lib.schema';
import { z } from 'zod';

const ReviewerModel = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
});

const AddressModel = z.object({
	line1: z.string(),
	line2: z.string().optional(),
	city: z.string().optional(),
	region: z.string().optional(),
	postalCode: z.string().optional(),
	countryCode: z.string().optional(),
}) satisfies z.ZodType<AddressFormValue>;

const PhoneModel = z.object({
	countryCode: z.string(),
	nationalNumber: z.string(),
	extension: z.string().optional(),
	e164: z.string().optional(),
}) satisfies z.ZodType<PhoneFormValue>;

export const FormShowcaseAllFieldsModel = fromZod(
	z.object({
		recordId: z.string(),
		fullName: z.string(),
		email: z.string().email(),
		username: z.string(),
		bio: z.string().optional(),
		currentPassword: z.string().optional(),
		newPassword: z.string().optional(),
		role: z.string(),
		contactPreference: z.string(),
		acceptTerms: z.boolean(),
		marketingOptIn: z.boolean(),
		reviewer: ReviewerModel,
		mailingAddress: AddressModel,
		phone: PhoneModel,
		birthDate: z.coerce.date().optional(),
		reminderTime: z.string().optional(),
		launchWindow: z.coerce.date().optional(),
		contacts: z.array(
			z.object({
				label: z.string(),
				value: z.string().email().optional(),
				preferred: z.boolean().optional(),
			})
		),
	}),
	{
		name: 'FormShowcaseAllFieldsModel',
		description:
			'Schema model for the complete ContractSpec form field matrix.',
	}
);

export const FormShowcaseProgressiveStepsModel = fromZod(
	z.object({
		companyName: z.string(),
		workspaceSlug: z.string(),
		plan: z.string(),
		ownerEmail: z.string().email(),
		needsSecurityReview: z.boolean(),
		securityNotes: z.string().optional(),
		goLiveDate: z.coerce.date().optional(),
	}),
	{
		name: 'FormShowcaseProgressiveStepsModel',
		description: 'Schema model for a step-based form layout template.',
	}
);
