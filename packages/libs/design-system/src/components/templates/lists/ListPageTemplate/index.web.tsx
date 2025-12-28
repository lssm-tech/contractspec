import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { PageHeaderResponsive } from '../../../organisms/PageHeaderResponsive';
import { FiltersToolbar } from '../../../molecules/FiltersToolbar';
import { AiLinkButton } from '../../../molecules/AiLinkButton';
import type { ListPageTemplateProps } from './types';
import { Skeleton } from '@contractspec/lib.ui-kit-web/ui/skeleton';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { EmptyDataList } from '../../../organisms/EmptyDataList';

const containerVariants = cva('space-y-4 md:space-y-6');

export * from './types';

export function ListPageTemplate<T = unknown>({
  children,
  title,
  description,
  breadcrumb,
  actions,
  className,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  isLoading,
  data,
  renderItem,
  emptyProps,
}: ListPageTemplateProps<T>) {
  const mdHref = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const url = new URL(window.location.href);
    url.pathname = url.pathname.replace(/\/$/, '') + '.md';
    return url.toString();
  }, []);

  const renderEmpty = () => {
    return (
      <Card>
        <CardContent>
          <EmptyDataList {...emptyProps} />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn(containerVariants(), className)}>
      <PageHeaderResponsive
        title={title}
        subtitle={description}
        breadcrumb={breadcrumb}
        actions={
          <>
            {actions}
            {mdHref && <AiLinkButton href={mdHref} />}
          </>
        }
      />
      <FiltersToolbar
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />
      <div className="space-y-2">
        {data?.map((item, index) => (
          <div key={index}>{renderItem({ item, index })}</div>
        ))}
        {!data?.length &&
          (isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-md" />
              ))
            : renderEmpty())}
      </div>

      {children}
    </div>
  );
}
