'use client';

import * as React from 'react';
import {
  PageHeader as WebPageHeader,
  type PageHeaderProps,
} from '@contractspec/lib.ui-kit-web/ui/page-header';
import { useResponsive } from '../../platform/useResponsive';

export type PageHeaderResponsiveProps = PageHeaderProps;

export function PageHeaderResponsive(props: PageHeaderResponsiveProps) {
  const { screen } = useResponsive();
  const spacing =
    screen === 'desktop' ? 'lg' : screen === 'tablet' ? 'md' : 'sm';
  return (
    <WebPageHeader
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spacing={props.spacing ?? (spacing as any)}
    />
  );
}
