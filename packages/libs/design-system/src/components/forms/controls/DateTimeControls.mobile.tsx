import {
	DatePicker as NativeDatePicker,
	type DatePickerProps as NativeDatePickerProps,
} from '@contractspec/lib.ui-kit/ui/date-picker';
import {
	DateRangePicker as NativeDateRangePicker,
	type DateRangePickerProps as NativeDateRangePickerProps,
} from '@contractspec/lib.ui-kit/ui/date-range-picker';
import {
	DateTimePicker as NativeDateTimePicker,
	type DateTimePickerProps as NativeDateTimePickerProps,
} from '@contractspec/lib.ui-kit/ui/datetime-picker';
import {
	TimePicker as NativeTimePicker,
	type TimePickerProps as NativeTimePickerProps,
} from '@contractspec/lib.ui-kit/ui/time-picker';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
	useTranslatedText,
} from '../../primitives/themed';

type BaseDateTimeProps = ThemedPrimitiveProps & { className?: string };

export type DatePickerProps = NativeDatePickerProps & BaseDateTimeProps;
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
		<NativeDatePicker
			{...themed.props}
			{...props}
			className={themed.className}
			placeholder={translate(placeholderI18n ?? placeholder)}
		/>
	);
}

export type TimePickerProps = NativeTimePickerProps & BaseDateTimeProps;
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
		<NativeTimePicker
			{...themed.props}
			{...props}
			className={themed.className}
			placeholder={translate(placeholderI18n ?? placeholder)}
		/>
	);
}

export type DateTimePickerProps = NativeDateTimePickerProps &
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
		<NativeDateTimePicker
			{...themed.props}
			{...props}
			className={themed.className}
			datePlaceholder={translate(datePlaceholderI18n ?? datePlaceholder)}
			timePlaceholder={translate(timePlaceholderI18n ?? timePlaceholder)}
		/>
	);
}

export type DateRangePickerProps = NativeDateRangePickerProps &
	BaseDateTimeProps;
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
		<NativeDateRangePicker
			{...themed.props}
			{...props}
			className={themed.className}
		/>
	);
}
