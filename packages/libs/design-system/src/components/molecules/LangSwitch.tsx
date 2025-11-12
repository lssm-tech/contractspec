'use client';

import * as React from 'react';
import { Button } from '../atoms/Button';

export interface LangOption {
  code: string; // e.g. 'en', 'fr'
  label: React.ReactNode;
}

export interface LangSwitchProps {
  value: string;
  options: LangOption[];
  onChange: (code: string) => void;
  size?: 'sm' | 'default';
}

export function LangSwitch({
  value,
  options,
  onChange,
  size = 'sm',
}: LangSwitchProps) {
  return (
    <div className="flex items-center gap-1">
      {options.map((opt) => (
        <Button
          key={opt.code}
          variant={value === opt.code ? 'default' : 'ghost'}
          size={size}
          onPress={() => onChange(opt.code)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
