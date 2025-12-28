import React, { useMemo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import type {
  AndroidNativeProps,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Text } from './text';

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
}

function formatDateDisplay(date: Date | null) {
  if (!date) return '';
  try {
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function DatePicker({
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
  placeholder = 'Select date',
  className,
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  const pickerProps = useMemo<Partial<AndroidNativeProps & IOSNativeProps>>(
    () => ({
      minimumDate: minDate,
      maximumDate: maxDate,
      timeZoneName: undefined,
    }),
    [minDate, maxDate]
  );

  const handleChange = (_event: unknown, selectedDate?: Date | undefined) => {
    if (Platform.OS !== 'ios') setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View className={cn('w-full', className)}>
      <Pressable
        disabled={disabled}
        onPress={() => setShow(true)}
        className={cn(
          'border-input bg-background h-12 flex-row items-center rounded-md border px-3',
          disabled && 'opacity-50'
        )}
      >
        <Text
          className={cn('text-foreground text-base', !value && 'opacity-50')}
        >
          {value ? formatDateDisplay(value) : placeholder}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(pickerProps as any)}
        />
      )}
    </View>
  );
}
