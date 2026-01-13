import type { HTMLAttributes } from 'react';

export interface CopyButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** The value to copy to clipboard */
  value: string;
  /** Optional callback when copy succeeds */
  onCopy?: () => void;
}
