export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSelectProps {
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  showCounts?: boolean;
}
