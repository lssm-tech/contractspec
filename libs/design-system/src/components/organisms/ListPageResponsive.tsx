'use client';

import * as React from 'react';
import { useResponsive } from '../../platform/useResponsive';
import { ListPage } from '@contractspec/lib.ui-kit-web/ui/organisms/ListPage';
import type { ListPageProps } from '@contractspec/lib.ui-kit-web/ui/organisms/ListPage/types';

export function ListPageResponsive<T>(props: ListPageProps<T>) {
  const { screen } = useResponsive();
  const className = [
    props.className,
    screen === 'desktop'
      ? 'space-y-6'
      : screen === 'tablet'
        ? 'space-y-5'
        : 'space-y-4',
  ]
    .filter(Boolean)
    .join(' ');
  return <ListPage {...props} className={className} />;
}
