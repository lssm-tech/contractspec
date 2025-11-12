'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from './utils';

export interface TimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
  is24Hour?: boolean;
  className?: string;
}

function formatTime(d: Date | null, is24Hour?: boolean) {
  if (!d) return '';
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !is24Hour,
  });
}

export function TimePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Select time',
  is24Hour = true,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hours, setHours] = React.useState<string>(() =>
    value ? String(value.getHours()).padStart(2, '0') : ''
  );
  const [minutes, setMinutes] = React.useState<string>(() =>
    value ? String(value.getMinutes()).padStart(2, '0') : ''
  );

  const commit = (h: number, m: number) => {
    const base = value ?? new Date();
    const next = new Date(base);
    next.setHours(h, m, 0, 0);
    onChange(next);
    setOpen(false);
  };

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
          {value ? (
            formatTime(value, is24Hour)
          ) : (
            <span className="opacity-50">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={is24Hour ? 23 : 12}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="border-input bg-background w-16 rounded-md border px-2 py-1 text-center"
          />
          <span>:</span>
          <input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="border-input bg-background w-16 rounded-md border px-2 py-1 text-center"
          />
          <Button
            type="button"
            onClick={() => commit(Number(hours || 0), Number(minutes || 0))}
            className="ml-auto"
          >
            Set
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
