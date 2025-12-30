'use client';

import * as React from 'react';
import {
  Form,
  useForm,
  type UseFormReturn,
  zodResolver,
} from '@contractspec/lib.ui-kit-web/ui/form';
import type { FieldValues } from 'react-hook-form';
import * as z from 'zod';

// import { useForm, type UseFormReturn } from 'react-hook-form';

export interface ZodFormProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TSchema extends z.ZodType<any, any, any>,
  TFieldValues extends FieldValues = z.input<TSchema>,
  TOutput = z.output<TSchema>,
> {
  schema: TSchema;
  defaultValues?: Partial<TFieldValues> | Promise<Partial<TFieldValues>>;
  onSubmit: (data: TOutput) => Promise<void> | void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (f: UseFormReturn<TFieldValues, any, TOutput>) => React.ReactNode;
}

export function ZodForm<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TSchema extends z.ZodType<any, any, any>,
  TFieldValues extends FieldValues = z.input<TSchema>,
  TOutput = z.output<TSchema>,
>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: ZodFormProps<TSchema, TFieldValues, TOutput>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<TFieldValues, any, TOutput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children(form)}</form>
    </Form>
  );
}
