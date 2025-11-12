import React from 'react';
import { HStack } from './stack';
import { DatePicker } from './date-picker';
import { TimePicker } from './time-picker';

export interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  datePlaceholder?: string;
  timePlaceholder?: string;
  is24Hour?: boolean;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
  datePlaceholder,
  timePlaceholder,
  is24Hour,
  className,
}: DateTimePickerProps) {
  const handleDateChange = (d: Date | null) => {
    if (!d) return;
    const next = new Date(d);
    if (value) {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }
    onChange(next);
  };

  const handleTimeChange = (t: Date | null) => {
    if (!t) return;
    const next = new Date(value ?? new Date());
    next.setHours(t.getHours(), t.getMinutes(), 0, 0);
    onChange(next);
  };

  return (
    <HStack className={className} gap="sm">
      <DatePicker
        value={value}
        onChange={handleDateChange}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        placeholder={datePlaceholder}
        className="flex-1"
      />
      <TimePicker
        value={value}
        onChange={handleTimeChange}
        disabled={disabled}
        is24Hour={is24Hour}
        placeholder={timePlaceholder}
        className="flex-1"
      />
    </HStack>
  );
}
