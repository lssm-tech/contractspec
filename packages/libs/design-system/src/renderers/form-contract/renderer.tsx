'use client';

import { shadcnDriver } from '@contractspec/lib.contracts-runtime-client-react/drivers/shadcn';
import { createFormRenderer } from '@contractspec/lib.contracts-runtime-client-react/form-render';
import { Autocomplete } from '../../components/forms/controls/Autocomplete';
import {
	Checkbox,
	RadioGroup,
	Switch,
} from '../../components/forms/controls/ChoiceControls';
import {
	DatePicker,
	DateTimePicker,
	TimePicker,
} from '../../components/forms/controls/DateTimeControls';
import {
	FieldContent,
	FieldGroup,
	FieldLegend,
	FieldSet,
	Field as FieldWrap,
	InputGroup,
	InputGroupAddon,
} from '../../components/forms/controls/Field';
import { Select } from '../../components/forms/controls/Select';
import { AddressField, PhoneField } from './rich-fields';
import {
	Actions,
	FieldArray,
	FieldArrayItem,
	FormRoot,
	InputGroupIcon,
	TranslatedButton,
	TranslatedCurrencyField,
	TranslatedDurationField,
	TranslatedFieldDescription,
	TranslatedFieldError,
	TranslatedFieldLabel,
	TranslatedInput,
	TranslatedInputGroupInput,
	TranslatedInputGroupText,
	TranslatedInputGroupTextarea,
	TranslatedNumberField,
	TranslatedPasswordInput,
	TranslatedPercentField,
	TranslatedTextarea,
} from './shell';

export const formRenderer = createFormRenderer({
	submitMode: 'button',
	driver: shadcnDriver({
		FormRoot,
		Field: FieldWrap,
		FieldLabel: TranslatedFieldLabel,
		FieldDescription: TranslatedFieldDescription,
		FieldError: TranslatedFieldError,
		FieldContent,
		FieldGroup,
		FieldSet,
		FieldLegend,
		FieldArray,
		FieldArrayItem,
		Actions,
		Input: TranslatedInput as never,
		NumberField: TranslatedNumberField as never,
		PercentField: TranslatedPercentField as never,
		CurrencyField: TranslatedCurrencyField as never,
		DurationField: TranslatedDurationField as never,
		PasswordInput: TranslatedPasswordInput as never,
		Textarea: TranslatedTextarea as never,
		InputGroup,
		InputGroupAddon,
		InputGroupInput: TranslatedInputGroupInput as never,
		InputGroupTextarea: TranslatedInputGroupTextarea as never,
		InputGroupText: TranslatedInputGroupText,
		InputGroupIcon,
		Select,
		Checkbox,
		RadioGroup,
		Switch,
		Autocomplete,
		AddressField,
		PhoneField,
		DateField: DatePicker as never,
		TimeField: TimePicker as never,
		DateTimeField: DateTimePicker as never,
		Button: TranslatedButton as never,
	}),
});
