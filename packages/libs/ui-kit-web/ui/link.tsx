import { forwardRef } from 'react';
import { cn } from './utils';
import NextLink from 'next/link';

const Link = forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement> & { href: string }
>(({ className, ...props }, ref) => {
  return (
    <NextLink
      ref={ref}
      className={cn('className="text-primary underline"', className)}
      {...props}
    />
  );
});
Link.displayName = 'Link';

export { Link };
