import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import NextLink from 'next/link';

function Link({
  className,
  ref,
  ...props
}: React.HTMLProps<HTMLAnchorElement> & {
  href: string;
  ref?: React.Ref<HTMLAnchorElement>;
}) {
  return (
    <NextLink
      ref={ref}
      className={cn('className="text-primary underline"', className)}
      {...props}
    />
  );
}

export { Link };
