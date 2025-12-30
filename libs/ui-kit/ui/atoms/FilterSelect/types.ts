export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSelectProps {
  value: FilterOption;
  options: FilterOption[];
  onChange: (value: FilterOption | undefined) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  showCounts?: boolean;
}
