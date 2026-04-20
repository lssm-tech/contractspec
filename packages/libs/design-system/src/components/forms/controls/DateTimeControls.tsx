'use client';

import {
	DatePicker as WebDatePicker,
	type DatePickerProps as WebDatePickerProps,
} from '@contractspec/lib.ui-kit-web/ui/date-picker';
import {
	DateRangePicker as WebDateRangePicker,
	type DateRangePickerProps as WebDateRangePickerProps,
} from '@contractspec/lib.ui-kit-web/ui/date-range-picker';
import {
	DateTimePicker as WebDateTimePicker,
	type DateTimePickerProps as WebDateTimePickerProps,
} from '@contractspec/lib.ui-kit-web/ui/datetime-picker';
import {
	TimePicker as WebTimePicker,
	type TimePickerProps as WebTimePickerProps,
} from '@contractspec/lib.ui-kit-web/ui/time-picker';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../../primitives/themed';

type BaseDateTimeProps = ThemedPrimitiveProps & { className?: string };

export type DatePickerProps = WebDatePickerProps & BaseDateTimeProps;
export function DatePicker({
	componentKey,
	themeVariant,
	placeholder,
	placeholderI18n,
	className,
	...props
}: DatePickerProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'DatePicker',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebDatePicker
			{...themed.props}
			{...props}
			className={themed.className}
			placeholder={translate(placeholderI18n ?? placeholder)}
		/>
	);
}

export type TimePickerProps = WebTimePickerProps & BaseDateTimeProps;
export function TimePicker({
	componentKey,
	themeVariant,
	placeholder,
	placeholderI18n,
	className,
	...props
}: TimePickerProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'TimePicker',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebTimePicker
			{...themed.props}
			{...props}
			className={themed.className}
			placeholder={translate(placeholderI18n ?? placeholder)}
		/>
	);
}

export type DateTimePickerProps = WebDateTimePickerProps &
	BaseDateTimeProps & {
		datePlaceholderI18n?: string;
		timePlaceholderI18n?: string;
	};
export function DateTimePicker({
	componentKey,
	themeVariant,
	datePlaceholder,
	timePlaceholder,
	datePlaceholderI18n,
	timePlaceholderI18n,
	className,
	...props
}: DateTimePickerProps) {
	const translate = useTranslatedText();
	const themed = useThemedPrimitive({
		defaultComponentKey: 'DateTimePicker',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebDateTimePicker
			{...themed.props}
			{...props}
			className={themed.className}
			datePlaceholder={translate(datePlaceholderI18n ?? datePlaceholder)}
			timePlaceholder={translate(timePlaceholderI18n ?? timePlaceholder)}
		/>
	);
}

export type DateRangePickerProps = WebDateRangePickerProps & BaseDateTimeProps;
export function DateRangePicker({
	componentKey,
	themeVariant,
	className,
	...props
}: DateRangePickerProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'DateRangePicker',
		componentKey,
		themeVariant,
		className,
	});
	return (
		<WebDateRangePicker
			{...themed.props}
			{...props}
			className={themed.className}
		/>
	);
}
