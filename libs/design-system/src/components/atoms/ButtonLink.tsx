'use client';

import * as React from 'react';
import { Button, type ButtonProps } from './Button';
import { Link, type LinkProps } from './Link.web';

export type ButtonLinkProps = Omit<ButtonProps, 'onClick'> &
  Pick<LinkProps, 'href' | 'target' | 'rel' | 'onClick'> & {
    replace?: boolean;
  };

export function ButtonLink({
  href,
  target,
  rel,
  replace,
  loading,
  disabled,
  children,
  onClick,
  ...btn
}: ButtonLinkProps) {
  const blocked = Boolean(disabled || loading);
  const handleClick = React.useCallback<
    React.MouseEventHandler<HTMLAnchorElement>
  >(
    (e) => {
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    },
    [blocked, onClick]
  );
  return (
    <Button {...btn} disabled={disabled} loading={loading} asChild>
      <Link href={href} target={target} rel={rel} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}
