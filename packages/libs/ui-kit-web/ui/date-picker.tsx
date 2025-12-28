'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Calendar } from './calendar';
import { Input } from './input';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
  language?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
  placeholder = 'Select date',
  className,
  language,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(value ?? new Date());
  const [textValue, setTextValue] = React.useState<string>(formatDate(value));

  React.useEffect(() => {
    setTextValue(formatDate(value));
    if (value) setMonth(value);
  }, [value]);

  function formatDate(date: Date | null | undefined) {
    if (!date) return '';
    return date.toLocaleDateString(language, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  function isValidDate(date: Date | undefined) {
    if (!date) return false;
    return !isNaN(date.getTime());
  }

  function isWithinRange(date: Date) {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn('relative w-full', className)}>
        <Input
          value={textValue}
          placeholder={placeholder}
          onChange={(e) => {
            const nextText = e.currentTarget.value;
            setTextValue(nextText);
            const parsed = new Date(nextText);
            if (isValidDate(parsed) && isWithinRange(parsed)) {
              onChange(parsed);
              setMonth(parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
          disabled={disabled}
          className={cn('pr-10')}
        />
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 -translate-y-1/2"
            disabled={disabled}
            aria-label="Open date picker"
          >
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="end"
        sideOffset={10}
        alignOffset={-8}
      >
        <Calendar
          mode="single"
          selected={value ?? undefined}
          captionLayout="dropdown"
          month={month}
          onMonthChange={setMonth}
          onSelect={(d) => {
            onChange(d ?? null);
            setTextValue(formatDate(d ?? null));
            if (d) setOpen(false);
          }}
          fromDate={minDate}
          toDate={maxDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
