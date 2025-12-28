'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface ActionFormProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'action'
> {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
}

export function ActionForm({
  action,
  children,
  className,
  ...rest
}: ActionFormProps) {
  return (
    <form action={action} className={cn('space-y-3', className)} {...rest}>
      {children}
    </form>
  );
}
