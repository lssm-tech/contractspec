import type { AnchorHTMLAttributes } from 'react';
import * as React from 'react';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ children, ...props }: LinkProps) {
  return <a {...props}>{children}</a>;
}
