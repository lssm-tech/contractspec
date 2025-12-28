'use client';

import * as React from 'react';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@contractspec/lib.ui-kit-web/ui/table';
import { useResponsive } from '../../platform/useResponsive';
import { cva, type VariantProps } from 'class-variance-authority';

export interface TableColumn<T> {
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
}

const containerVariants = cva('', {
  variants: {
    density: {
      compact: 'gap-3',
      comfortable: 'gap-4 md:gap-5',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

export interface ListTablePageProps<T> extends VariantProps<
  typeof containerVariants
> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  items: T[];
  columns: TableColumn<T>[];
  className?: string;
  renderActions?: (item: T, index: number) => React.ReactNode;
}

export function ListTablePage<T>({
  title,
  subtitle,
  items,
  columns,
  className,
  density,
  renderActions,
}: ListTablePageProps<T>) {
  const { screen } = useResponsive();
  const titleSize = screen === 'desktop' ? 'text-3xl' : 'text-2xl';

  return (
    <VStack
      className={[containerVariants({ density }), className]
        .filter(Boolean)
        .join(' ')}
    >
      <VStack className="gap-1">
        <h1 className={`${titleSize} font-bold`}>{title}</h1>
        {subtitle ? (
          <p className="text-muted-foreground text-base">{subtitle}</p>
        ) : null}
      </VStack>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.header}
              </TableHead>
            ))}
            {renderActions ? <TableHead /> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, rowIdx) => (
            <TableRow key={rowIdx}>
              {columns.map((col, colIdx) => (
                <TableCell key={colIdx} className={col.className}>
                  {col.cell(item, rowIdx)}
                </TableCell>
              ))}
              {renderActions ? (
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {renderActions(item, rowIdx)}
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </VStack>
  );
}
