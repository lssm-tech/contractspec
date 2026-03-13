'use client';

import * as React from 'react';
import * as Slot from '@rn-primitives/slot';
import { View as RNView } from 'react-native';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form';

import { Label } from './label';
import { P } from './typography';

export { zodResolver } from '@hookform/resolvers/zod';
export { useForm, type UseFormReturn, useFieldArray } from 'react-hook-form';

const Form = FormProvider;

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fallbackId = React.useId();
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();

  if (!fieldContext?.name) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const id = itemContext?.id ?? fallbackId;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({
  className,
  ...props
}: React.ComponentProps<typeof RNView>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <RNView
        data-slot="form-item"
        className={cn('flex flex-col gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({
  asChild = false,
  ...props
}: React.ComponentProps<typeof RNView> & {
  asChild?: boolean;
}) {
  const Component = asChild ? Slot.Text : RNView;
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Component
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<typeof P>) {
  const { formDescriptionId } = useFormField();

  return (
    <P
      data-slot="form-description"
      nativeID={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<typeof P>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;

  if (!body) {
    return null;
  }

  return (
    <P
      data-slot="form-message"
      nativeID={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </P>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
