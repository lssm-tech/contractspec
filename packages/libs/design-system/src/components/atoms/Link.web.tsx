import * as React from 'react';
import NextLink from 'next/link';
import type { UrlObject } from 'url';

export type LinkProps = {
  href?: string | UrlObject;
  children?: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & Record<string, unknown>;

export function Link({ href, children, ...props }: LinkProps) {
  return (
    <NextLink href={href || '#'} {...props}>
      {children}
    </NextLink>
  );
}
