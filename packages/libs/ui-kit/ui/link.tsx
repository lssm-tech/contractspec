import * as React from 'react';
import { Link as LinkExpo, type LinkProps } from 'expo-router';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

function Link({
  className,
  ...props
}: LinkProps & {
  ref?: React.RefObject<typeof LinkExpo>;
}) {
  return (
    <LinkExpo
      className={cn('className="text-primary underline"', className)}
      {...props}
    />
  );
}

export { Link };
