import type { HTMLAttributes } from 'react';

export type CodeLanguage =
  | 'typescript'
  | 'tsx'
  | 'javascript'
  | 'jsx'
  | 'bash'
  | 'shell'
  | 'json'
  | 'yaml'
  | 'graphql'
  | 'sql'
  | 'python'
  | 'go'
  | 'rust'
  | 'css'
  | 'scss'
  | 'html'
  | 'markdown'
  | 'text';

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** The code to display */
  code: string;
  /** The language for syntax highlighting */
  language?: CodeLanguage;
  /** Optional filename to display in header */
  filename?: string;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Whether to show the copy button */
  showCopyButton?: boolean;
  /** Optional callback when copy succeeds */
  onCopy?: () => void;
}
