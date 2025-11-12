'use client';

import * as React from 'react';
import { VStack } from '@lssm/lib.ui-kit/ui/stack';

export interface HeaderProps {
  logo: React.ReactNode;
  nav: any[];
  userMenu?: any;
  cta?: any;
  className?: string;
  density?: 'compact' | 'comfortable';
  mobileSidebar?: {
    sections: any[];
    top?: React.ReactNode;
    bottom?: React.ReactNode;
  };
}

export function Header({ logo }: HeaderProps) {
  return <VStack className="px-3 py-2">{logo}</VStack>;
}

export const DesktopHeader = Header;
export const MobileHeader = Header;
