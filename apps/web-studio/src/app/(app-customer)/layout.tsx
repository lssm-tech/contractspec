import type React from 'react';
import { StudioAppShellLayout } from '@contractspec/bundle.studio/presentation/components';

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StudioAppShellLayout>{children}</StudioAppShellLayout>;
}
