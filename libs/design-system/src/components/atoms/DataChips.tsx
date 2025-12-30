import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Calendar, Clock, MapPin } from 'lucide-react';

const chip = cva(
  'inline-flex items-center gap-1 text-base text-muted-foreground',
  {
    variants: {
      size: { sm: 'text-sm', md: 'text-base' },
      tone: { default: '', muted: 'opacity-85' },
    },
    defaultVariants: { size: 'md', tone: 'default' },
  }
);

export type ChipVariants = VariantProps<typeof chip>;

export function DateChip({
  value,
  ...v
}: { value?: string | Date | null } & ChipVariants) {
  if (!value) return null;
  let text = '';
  try {
    const d = typeof value === 'string' ? new Date(value) : value;
    text = d.toLocaleDateString();
  } catch {
    text = String(value);
  }
  return (
    <span className={chip(v)}>
      <Calendar className="h-4 w-4" /> {text}
    </span>
  );
}

export function TimeChip({
  value,
  ...v
}: { value?: string | Date | null } & ChipVariants) {
  if (!value) return null;
  let text = '';
  try {
    const d = typeof value === 'string' ? new Date(value) : value;
    text = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    text = String(value);
  }
  return (
    <span className={chip(v)}>
      <Clock className="h-4 w-4" /> {text}
    </span>
  );
}

export function PlaceChip({
  label,
  ...v
}: { label?: React.ReactNode } & ChipVariants) {
  if (!label) return null;
  return (
    <span className={chip(v)}>
      <MapPin className="h-4 w-4" /> {label}
    </span>
  );
}

export function DurationChip({
  minutes,
  ...v
}: { minutes?: number | null } & ChipVariants) {
  if (minutes == null) return null;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const text =
    hrs > 0
      ? `${hrs}h${mins > 0 ? String(mins).padStart(2, '0') : ''}`
      : `${mins}min`;
  return (
    <span className={chip(v)}>
      <Clock className="h-4 w-4" /> {text}
    </span>
  );
}
