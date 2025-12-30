'use client';

import * as React from 'react';
import { DatePicker } from './date-picker';
import { TimePicker } from './time-picker';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

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
  const handleDate = (d: Date | null) => {
    if (!d) return;
    const next = new Date(d);
    if (value) next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    onChange(next);
  };
  const handleTime = (t: Date | null) => {
    if (!t) return;
    const next = new Date(value ?? new Date());
    next.setHours(t.getHours(), t.getMinutes(), 0, 0);
    onChange(next);
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <DatePicker
        value={value}
        onChange={handleDate}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        placeholder={datePlaceholder}
      />
      <TimePicker
        value={value}
        onChange={handleTime}
        disabled={disabled}
        is24Hour={is24Hour}
        placeholder={timePlaceholder}
      />
    </div>
  );
}
