import type {
	SharedDateRange,
	SharedDateRangePickerProps,
} from '@contractspec/lib.ui-kit-core/interfaces';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable } from 'react-native';
import { HStack, VStack } from './stack';
import { Text } from './text';

export interface DateRange extends SharedDateRange {}

export interface DateRangePickerProps extends SharedDateRangePickerProps {}

function fmt(d: Date | null) {
	if (!d) return '';
	try {
		return d.toLocaleDateString();
	} catch {
		return '';
	}
}

export function DateRangePicker({
	value,
	onChange,
	disabled,
	minDate,
	maxDate,
	placeholders,
	className,
}: DateRangePickerProps) {
	const [showStart, setShowStart] = useState(false);
	const [showEnd, setShowEnd] = useState(false);

	const pickerCommon = useMemo(
		() => ({ minimumDate: minDate, maximumDate: maxDate }),
		[minDate, maxDate]
	);

	const handleStart = (_: unknown, d?: Date) => {
		if (Platform.OS !== 'ios') setShowStart(false);
		if (!d) return;
		const end = value.end && d > value.end ? d : value.end;
		onChange({ start: d, end });
	};
	const handleEnd = (_: unknown, d?: Date) => {
		if (Platform.OS !== 'ios') setShowEnd(false);
		if (!d) return;
		const start = value.start && d < value.start ? d : value.start;
		onChange({ start, end: d });
	};

	return (
		<VStack className={cn('w-full', className)} spacing="sm">
			<HStack gap="sm">
				<Pressable
					disabled={disabled}
					onPress={() => setShowStart(true)}
					className={cn(
						'h-12 flex-1 flex-row items-center rounded-md border border-input bg-background px-3',
						disabled && 'opacity-50'
					)}
				>
					<Text
						className={cn(
							'text-base text-foreground',
							!value.start && 'opacity-50'
						)}
					>
						{value.start
							? fmt(value.start)
							: placeholders?.start || 'Start date'}
					</Text>
				</Pressable>
				<Pressable
					disabled={disabled}
					onPress={() => setShowEnd(true)}
					className={cn(
						'h-12 flex-1 flex-row items-center rounded-md border border-input bg-background px-3',
						disabled && 'opacity-50'
					)}
				>
					<Text
						className={cn(
							'text-base text-foreground',
							!value.end && 'opacity-50'
						)}
					>
						{value.end ? fmt(value.end) : placeholders?.end || 'End date'}
					</Text>
				</Pressable>
			</HStack>

			{showStart && (
				<DateTimePicker
					value={value.start ?? new Date()}
					mode="date"
					display={Platform.OS === 'ios' ? 'inline' : 'default'}
					onChange={handleStart}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					{...(pickerCommon as any)}
				/>
			)}
			{showEnd && (
				<DateTimePicker
					value={value.end ?? value.start ?? new Date()}
					mode="date"
					display={Platform.OS === 'ios' ? 'inline' : 'default'}
					onChange={handleEnd}
					minimumDate={value.start ?? minDate}
					maximumDate={maxDate}
				/>
			)}
		</VStack>
	);
}
