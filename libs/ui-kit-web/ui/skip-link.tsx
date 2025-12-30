import * as React from 'react';

interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
  children?: React.ReactNode;
}

const defaultClasses =
  'sr-only focus:not-sr-only focus-visible:outline-solid focus-visible:ring-4 focus-visible:ring-offset-2 fixed top-2 left-2 z-100 rounded-xs bg-background px-3 py-2 text-sm shadow-2xs';

export function SkipLink({
  targetId = 'main',
  children,
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      className={[defaultClasses, className].filter(Boolean).join(' ')}
      href={`#${targetId}`}
      {...props}
    >
      {children ?? 'Skip to main content'}
    </a>
  );
}
