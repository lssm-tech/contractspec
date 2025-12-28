import * as React from 'react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@contractspec/lib.ui-kit-web/ui/empty';
import { Input } from '../atoms/Input';

export interface EmptySearchResultProps {
  emptySearchTitle?: React.ReactNode;
  emtptySearchTitle?: React.ReactNode; // alias
  emptySearchDescription?: React.ReactNode;
  emtptySearchDescription?: React.ReactNode; // alias
  onSearchChange?: (value: string) => void;
  handleSearchChange?: (value: string) => void; // alias
  className?: string;
}

export function EmptySearchResult({
  emptySearchTitle,
  emtptySearchTitle,
  emptySearchDescription,
  emtptySearchDescription,
  onSearchChange,
  handleSearchChange,
  className,
}: EmptySearchResultProps) {
  const title = emptySearchTitle ?? emtptySearchTitle ?? 'No results';
  const description =
    emptySearchDescription ?? emtptySearchDescription ?? 'Try another search.';
  const onChange = onSearchChange ?? handleSearchChange;
  const [q, setQ] = React.useState('');

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      <EmptyContent>
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            onChange?.(e.target.value);
          }}
          placeholder="Search…"
          keyboard={{ kind: 'search' }}
        />
      </EmptyContent>
    </Empty>
  );
}
