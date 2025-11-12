import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../input';
import { Button } from '../../button';
import type { SearchInputProps } from './types';

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher...',
  onClear,
  disabled = false,
  className = '',
  autoFocus = false,
}) => {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="text-muted-foreground h-4 w-4" />
      </div>

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="pr-10 pl-10"
      />

      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="text-muted-foreground hover:text-foreground h-4 w-4" />
            <span className="sr-only">Effacer la recherche</span>
          </Button>
        </div>
      )}
    </div>
  );
};
