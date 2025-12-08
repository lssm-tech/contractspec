import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-core';

function Link({
  className,
  ...props
}: React.HTMLProps<HTMLAnchorElement> & {
  href: string;
}) {
  return <a className={cn('', className)} {...props} />;
}

export default Link;
