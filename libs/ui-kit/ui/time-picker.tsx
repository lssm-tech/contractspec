import React, { useMemo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import type {
  AndroidNativeProps,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Text } from './text';

export interface TimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
  is24Hour?: boolean;
  className?: string;
}

function formatTimeDisplay(date: Date | null, is24Hour?: boolean) {
  if (!date) return '';
  try {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !is24Hour,
    });
  } catch {
    return '';
  }
}

export function TimePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Select time',
  is24Hour = true,
  className,
}: TimePickerProps) {
  const [show, setShow] = useState(false);

  const pickerProps = useMemo<Partial<AndroidNativeProps & IOSNativeProps>>(
    () => ({
      is24Hour,
      timeZoneName: undefined,
    }),
    [is24Hour]
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
          {value ? formatTimeDisplay(value, is24Hour) : placeholder}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(pickerProps as any)}
        />
      )}
    </View>
  );
}
