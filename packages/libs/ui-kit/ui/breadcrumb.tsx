import * as React from 'react';
import * as Slot from '@rn-primitives/slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { Text, View, type ViewProps } from 'react-native';

import { cn } from '@lssm/lib.ui-kit-core/utils';

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="breadcrumb-list"
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<typeof View> & {
  asChild?: boolean;
}) {
  // const Comp = asChild ? Slot : View;

  return (
    <View
      data-slot="breadcrumb-link"
      className={cn('hover:text-foreground transition-colors', className)}
      {...props}
    />
  );
}

function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled
      aria-current="page"
      className={cn('text-foreground font-normal', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      role="presentation"
      data-slot="breadcrumb-separator"
      aria-hidden
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </View>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <View className="sr-only">
        <Text>More</Text>
      </View>
    </View>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
