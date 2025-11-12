'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Calendar } from './calendar';
import { cn } from './utils';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            className
          )}
        >
          {value.start && value.end ? (
            `${value.start.toLocaleDateString()} - ${value.end.toLocaleDateString()}`
          ) : (
            <span className="opacity-50">Select date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={
            value.start && value.end
              ? { from: value.start, to: value.end }
              : undefined
          }
          onSelect={(range: any) => {
            const start = range?.from ?? null;
            const end = range?.to ?? null;
            onChange({ start, end });
          }}
          fromDate={minDate}
          toDate={maxDate}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
