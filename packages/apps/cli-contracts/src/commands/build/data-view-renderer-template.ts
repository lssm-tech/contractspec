export function generateDataViewRendererTemplate({
  exportName,
  specImportPath,
  rendererName,
  viewKind,
}: {
  exportName: string;
  specImportPath: string;
  rendererName: string;
  viewKind: string;
}) {
  return `'use client';

import * as React from 'react';
import { DataViewRenderer } from '@lssm/lib.design-system';
import { ${exportName} } from '${specImportPath}';

export interface ${rendererName}Props {
  items?: Record<string, unknown>[];
  item?: Record<string, unknown> | null;
  className?: string;
  renderActions?: (item: Record<string, unknown>) => React.ReactNode;
  onSelect?: (item: Record<string, unknown>) => void;
  onRowClick?: (item: Record<string, unknown>) => void;
  headerActions?: React.ReactNode;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Auto-generated renderer for the "${viewKind}" data view.
 * Customize as needed for app-specific behaviour.
 */
export function ${rendererName}({
  items = [],
  item = null,
  className,
  renderActions,
  onSelect,
  onRowClick,
  headerActions,
  emptyState,
  footer,
}: ${rendererName}Props) {
  return (
    <DataViewRenderer
      spec={${exportName}}
      items={items}
      item={item}
      className={className}
      renderActions={renderActions}
      onSelect={onSelect}
      onRowClick={onRowClick}
      headerActions={headerActions}
      emptyState={emptyState}
      footer={footer}
    />
  );
}
`;
}


