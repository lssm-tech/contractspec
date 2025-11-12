'use client';
import React from 'react';
import { createFormRenderer } from '@lssm/lib.contracts/client/react/form-render';
import { shadcnDriver } from '@lssm/lib.contracts/client/react/drivers/shadcn';

// Minimal shadcn driver mapping: host must wire its components here.
// Replace these placeholders with actual shadcn/ui imports in your app.
import {
  Field as FieldWrap,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@lssm/lib.ui-kit-web/ui/field';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Textarea } from '../components/atoms/Textarea';
import { Switch as SwitchUiKit } from '@lssm/lib.ui-kit-web/ui/switch';
import {
  RadioGroup as RadioGroupUiKit,
  RadioGroupItem,
} from '@lssm/lib.ui-kit-web/ui/radio-group';
import { Checkbox as CheckboxUiKit } from '@lssm/lib.ui-kit-web/ui/checkbox';
import {
  Select as SelectUiKit,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';

// Select/Checkbox/Radio/Switch are app-specific; provide thin wrappers.
const Select = (props: any) => {
  const { options, value, onChange, ...rest } = props;
  return (
    <SelectUiKit
      value={value ?? ''}
      onValueChange={(v) => onChange?.(v)}
      {...rest}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          {/* <SelectItem value="" disabled hidden></SelectItem> */}
          {options?.map((o: any, i: number) => (
            <SelectItem key={i} value={o.value} disabled={o.disabled}>
              {o.labelI18n}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectUiKit>
  );
};
const Checkbox = (props: any) => (
  <CheckboxUiKit
    checked={!!props.checked}
    onCheckedChange={(v) => props.onCheckedChange?.(v)}
    {...props}
  />
);
const RadioGroup = (props: any) => (
  <RadioGroupUiKit {...props}>
    {props.options?.map((o: any, i: number) => (
      <div className="flex items-center gap-3">
        <RadioGroupItem value={o.value} id={o.value} />
        <Label htmlFor={o.value}>{o.label}</Label>
      </div>
    ))}
  </RadioGroupUiKit>
);
const Switch = (props: any) => (
  <SwitchUiKit
    checked={!!props.checked}
    onCheckedChange={(v) => props.onCheckedChange?.(v)}
    {...props}
  />
);

export const formRenderer = createFormRenderer({
  driver: shadcnDriver({
    Field: FieldWrap,
    FieldLabel: FieldLabel,
    FieldDescription: FieldDescription,
    FieldError: FieldError,
    FieldGroup: FieldGroup,
    FieldSet: (p: any) => <fieldset {...p} />,
    FieldLegend: (p: any) => <legend {...p} />,
    Input: Input as any,
    Textarea: Textarea as any,
    Select: Select,
    Checkbox: Checkbox,
    RadioGroup: RadioGroup,
    Switch: Switch,
    Button: Button as any,
  }),
});
