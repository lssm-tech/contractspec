import * as React from 'react';
import NextLink from 'next/link';

export type LinkProps = {
  href: any; // keep loose to avoid type coupling with Next.js types
  children?: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & Record<string, any>;

export function Link({ href, children, ...props }: LinkProps) {
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}
