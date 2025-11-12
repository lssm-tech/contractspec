'use client';

import * as React from 'react';
import {
  EmptyState as WebEmptyState,
  type EmptyStateProps,
} from '@lssm/lib.ui-kit-web/ui/empty-state';

export function EmptyState(props: EmptyStateProps) {
  return <WebEmptyState {...props} />;
}
