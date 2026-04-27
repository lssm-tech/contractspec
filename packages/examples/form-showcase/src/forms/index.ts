import { FormRegistry } from '@contractspec/lib.contracts-spec/forms';
import { FormShowcaseAllFieldsForm } from './all-fields.form';
import { FormShowcaseProgressiveStepsForm } from './progressive-steps.form';

export const FormShowcaseRegistry = new FormRegistry()
	.register(FormShowcaseAllFieldsForm)
	.register(FormShowcaseProgressiveStepsForm);

export const FormShowcaseForms = [
	FormShowcaseAllFieldsForm,
	FormShowcaseProgressiveStepsForm,
] as const;

export * from './all-fields.form';
export * from './form-showcase.docs';
export * from './progressive-steps.form';
