'use client';

import * as React from 'react';
import {
  PageHeader as WebPageHeader,
  type PageHeaderProps,
} from '@lssm/lib.ui-kit-web/ui/page-header';
import { useResponsive } from '../../platform/useResponsive';

export interface PageHeaderResponsiveProps extends PageHeaderProps {}

export function PageHeaderResponsive(props: PageHeaderResponsiveProps) {
  const { screen } = useResponsive();
  const spacing =
    screen === 'desktop' ? 'lg' : screen === 'tablet' ? 'md' : 'sm';
  return (
    <WebPageHeader {...props} spacing={props.spacing ?? (spacing as any)} />
  );
}
