'use client';

import * as React from 'react';
import {
  Form,
  useForm,
  type UseFormReturn,
  zodResolver,
} from '@lssm/lib.ui-kit-web/ui/form';
import type { FieldValues } from 'react-hook-form';
import { z } from 'zod';

// import { useForm, type UseFormReturn } from 'react-hook-form';

export interface ZodFormProps<
  TSchema extends z.ZodType<any, FieldValues>,
  TFieldValues extends FieldValues = z.input<TSchema>,
  TOutput = z.output<TSchema>,
> {
  schema: TSchema;
  defaultValues?: Partial<TFieldValues> | Promise<Partial<TFieldValues>>;
  onSubmit: (data: TOutput) => Promise<void> | void;
  children: (f: UseFormReturn<TFieldValues, any, TOutput>) => React.ReactNode;
}

export function ZodForm<
  TSchema extends z.ZodType<any, FieldValues>,
  TFieldValues extends FieldValues = z.input<TSchema>,
  TOutput = z.output<TSchema>,
>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: ZodFormProps<TSchema, TFieldValues, TOutput>) {
  const form = useForm<TFieldValues, any, TOutput>({
    resolver: zodResolver<TFieldValues, any, TOutput>(schema as any),
    defaultValues: defaultValues as any,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children(form)}</form>
    </Form>
  );
}
