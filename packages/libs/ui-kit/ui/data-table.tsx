import * as React from 'react';
import { ChevronDown, ChevronRight, Columns3 } from 'lucide-react-native';
import type {
  ContractTableColumnRenderModel,
  ContractTableController,
  ContractTableRowRenderModel,
} from '@contractspec/lib.presentation-runtime-core';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { ScrollView, View } from 'react-native';
import { Button } from './button';
import { Checkbox } from './checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Pagination } from './atoms/Pagination';
import { Skeleton } from './skeleton';
import { HStack, VStack } from './stack';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Text } from './text';

export interface DataTableProps<TItem = unknown> {
  controller: ContractTableController<TItem, React.ReactNode>;
  className?: string;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  emptyState?: React.ReactNode;
  loading?: boolean;
  onRowPress?: (
    row: ContractTableRowRenderModel<TItem, React.ReactNode>
  ) => void;
}

export function DataTable<TItem>({
  controller,
  className,
  toolbar,
  footer,
  emptyState,
  loading,
  onRowPress,
}: DataTableProps<TItem>) {
  const leftColumns = controller.visibleColumns.filter(
    (column) => column.pinState === 'left'
  );
  const centerColumns = controller.visibleColumns.filter(
    (column) => !column.pinState
  );
  const rightColumns = controller.visibleColumns.filter(
    (column) => column.pinState === 'right'
  );

  return (
    <VStack gap="md" className={className}>
      <HStack justify="between" align="center">
        <View>{toolbar}</View>
        <ColumnVisibilityMenu columns={controller.columns} />
      </HStack>

      {loading ? (
        <VStack gap="sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </VStack>
      ) : controller.rows.length === 0 ? (
        (emptyState ?? (
          <View className="border-border rounded-md border border-dashed p-6">
            <Text className="text-muted-foreground text-center">
              No rows available.
            </Text>
          </View>
        ))
      ) : (
        <View className="border-border rounded-md border">
          <HStack gap="none" align="start" wrap="nowrap">
            {leftColumns.length
              ? renderSection(controller, leftColumns, onRowPress)
              : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {renderSection(controller, centerColumns, onRowPress)}
            </ScrollView>
            {rightColumns.length
              ? renderSection(controller, rightColumns, onRowPress)
              : null}
          </HStack>
        </View>
      )}

      {controller.pageCount > 0 ? (
        <Pagination
          currentPage={controller.pageIndex + 1}
          totalPages={controller.pageCount}
          totalItems={controller.totalItems}
          itemsPerPage={controller.pageSize}
          onPageChange={(page) => controller.setPageIndex(page - 1)}
          onItemsPerPageChange={(pageSize) => controller.setPageSize(pageSize)}
        />
      ) : null}

      {footer}
    </VStack>
  );
}

function renderSection<TItem>(
  controller: ContractTableController<TItem, React.ReactNode>,
  columns: ContractTableColumnRenderModel<React.ReactNode>[],
  onRowPress?: (
    row: ContractTableRowRenderModel<TItem, React.ReactNode>
  ) => void
) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              style={{ width: column.size, minWidth: column.size }}
            >
              <HStack gap="sm" align="center" justify="between" wrap="nowrap">
                <View>{renderHeaderContent(controller, column)}</View>
                {column.canResize ? <ResizeHandle column={column} /> : null}
              </HStack>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {controller.rows.map((row) => (
          <VStack key={row.id} gap="none">
            <TableRow onPress={() => onRowPress?.(row)}>
              {columns.map((column) => {
                const cell = row.cells.find(
                  (candidate) => candidate.columnId === column.id
                );
                return (
                  <TableCell
                    key={column.id}
                    style={{ width: column.size, minWidth: column.size }}
                  >
                    {renderCellContent(row, cell)}
                  </TableCell>
                );
              })}
            </TableRow>
            {row.isExpanded && row.expandedContent ? (
              <TableRow>
                <TableCell
                  style={{
                    width: columns.reduce(
                      (sum, column) => sum + column.size,
                      0
                    ),
                  }}
                >
                  {row.expandedContent}
                </TableCell>
              </TableRow>
            ) : null}
          </VStack>
        ))}
      </TableBody>
    </Table>
  );
}

function ColumnVisibilityMenu({
  columns,
}: {
  columns: ContractTableController<unknown, React.ReactNode>['columns'];
}) {
  const hideableColumns = columns.filter((column) => column.canHide);
  if (!hideableColumns.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns3 size={16} />
          <Text>Columns</Text>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.visible}
            onCheckedChange={(checked) =>
              column.toggleVisibility?.(Boolean(checked))
            }
          >
            <Text>{column.label}</Text>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ResizeHandle({
  column,
}: {
  column: ContractTableColumnRenderModel<React.ReactNode>;
}) {
  const lastTranslation = React.useRef(0);

  return (
    <PanGestureHandler
      onGestureEvent={(event) => {
        const delta = event.nativeEvent.translationX - lastTranslation.current;
        lastTranslation.current = event.nativeEvent.translationX;
        column.resizeBy?.(delta);
      }}
      onEnded={() => {
        lastTranslation.current = 0;
      }}
    >
      <View className="justify-center px-1">
        <Text className="text-muted-foreground text-xs">||</Text>
      </View>
    </PanGestureHandler>
  );
}

function renderHeaderContent<TItem>(
  controller: ContractTableController<TItem, React.ReactNode>,
  column: ContractTableColumnRenderModel<React.ReactNode>
) {
  if (column.kind === 'selection' && controller.selectionMode === 'multiple') {
    return (
      <Checkbox
        checked={controller.allRowsSelected || controller.someRowsSelected}
        onCheckedChange={(checked) =>
          controller.toggleAllRowsSelected?.(Boolean(checked))
        }
      />
    );
  }
  if (column.kind === 'expansion') return null;
  return typeof column.header === 'string' ? (
    <Text>{column.header}</Text>
  ) : (
    column.header
  );
}

function renderCellContent<TItem>(
  row: ContractTableRowRenderModel<TItem, React.ReactNode>,
  cell:
    | ContractTableRowRenderModel<TItem, React.ReactNode>['cells'][number]
    | undefined
) {
  if (!cell) return null;
  if (cell.kind === 'selection') {
    return (
      <Checkbox
        checked={row.isSelected}
        onCheckedChange={(checked) => row.toggleSelected?.(Boolean(checked))}
      />
    );
  }
  if (cell.kind === 'expansion') {
    if (!row.canExpand) return null;
    return (
      <Button
        variant="ghost"
        size="icon"
        onPress={() => row.toggleExpanded?.()}
      >
        {row.isExpanded ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </Button>
    );
  }
  return typeof cell.content === 'string' ? (
    <Text>{cell.content}</Text>
  ) : (
    cell.content
  );
}
