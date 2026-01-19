import type React from 'react';
import DocsShellClient from './DocsShellClient';

export const dynamic = 'force-static';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsShellClient>{children}</DocsShellClient>;
}
