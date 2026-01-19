import * as React from 'react';

export interface NavLink {
  label: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  target?: '_self' | '_blank';
  ariaLabel?: string;
  external?: boolean;
  description?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  categories?: string[];
  onClick?: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface NavSection {
  title?: React.ReactNode;
  items: NavLink[];
}

export interface UserMenuItem {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

export interface HeaderNavItem {
  label: React.ReactNode;
  href?: string;
  description?: React.ReactNode;
  key?: string;
  items?: NavLink[]; // optional mega menu group
  match?: 'exact' | 'startsWith';
}

export interface CtaAction {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}
