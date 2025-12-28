import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface FormCardLayoutProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormCardLayout({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: FormCardLayoutProps) {
  return (
    <Card className={cn('border-none shadow-2xs', className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && (
            <div className="text-muted-foreground text-base">{description}</div>
          )}
        </CardHeader>
      )}
      <CardContent className={cn('p-4 md:p-5', contentClassName)}>
        <div className="space-y-4">{children}</div>
        {actions && (
          <div className="mt-4 flex justify-end gap-2">{actions}</div>
        )}
      </CardContent>
    </Card>
  );
}
