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
	FieldGroup,
	Field as FieldWrap,
} from '../../components/forms/controls/Field';
import { Select } from '../../components/forms/controls/Select';
import { VStack } from '../../components/layout/Stack';
import { AddressField, PhoneField } from './rich-fields';
import {
	Actions,
	FieldArray,
	FieldArrayItem,
	FieldLegend,
	FormRoot,
	TranslatedButton,
	TranslatedFieldDescription,
	TranslatedFieldError,
	TranslatedFieldLabel,
	TranslatedInput,
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
		FieldGroup,
		FieldSet: (props) => <VStack gap="md" {...props} />,
		FieldLegend,
		FieldArray,
		FieldArrayItem,
		Actions,
		Input: TranslatedInput as never,
		Textarea: TranslatedTextarea as never,
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
