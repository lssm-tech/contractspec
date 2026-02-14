'use client';
import React from 'react';
import { createFormRenderer } from '@contractspec/lib.contracts-runtime-client-react/form-render';
import { shadcnDriver } from '@contractspec/lib.contracts-runtime-client-react/drivers/shadcn';

// Minimal shadcn driver mapping: host must wire its components here.
// Replace these placeholders with actual shadcn/ui imports in your app.
import {
  Field as FieldWrap,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@contractspec/lib.ui-kit-web/ui/field';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Textarea } from '../components/atoms/Textarea';
import { Switch as SwitchUiKit } from '@contractspec/lib.ui-kit-web/ui/switch';
import {
  RadioGroup as RadioGroupUiKit,
  RadioGroupItem,
} from '@contractspec/lib.ui-kit-web/ui/radio-group';
import { Checkbox as CheckboxUiKit } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import {
  Select as SelectUiKit,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@contractspec/lib.ui-kit-web/ui/select';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';

// Select/Checkbox/Radio/Switch are app-specific; provide thin wrappers.
interface FormOption {
  value: string;
  label?: string;
  labelI18n?: string;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          {(options as FormOption[] | undefined)?.map((o, i) => (
            <SelectItem key={i} value={o.value} disabled={o.disabled}>
              {o.labelI18n}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectUiKit>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Checkbox = (props: any) => (
  <CheckboxUiKit
    checked={!!props.checked}
    onCheckedChange={(v) => props.onCheckedChange?.(v)}
    {...props}
  />
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RadioGroup = (props: any) => (
  <RadioGroupUiKit {...props}>
    {(props.options as FormOption[] | undefined)?.map((o) => (
      <div key={o.value} className="flex items-center gap-3">
        <RadioGroupItem value={o.value} id={o.value} />
        <Label htmlFor={o.value}>{o.label}</Label>
      </div>
    ))}
  </RadioGroupUiKit>
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FieldSet: (p: any) => <fieldset {...p} />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FieldLegend: (p: any) => <legend {...p} />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Input: Input as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Textarea: Textarea as any,
    Select: Select,
    Checkbox: Checkbox,
    RadioGroup: RadioGroup,
    Switch: Switch,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Button: Button as any,
  }),
});
