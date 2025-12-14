import type React from 'react';
import { StudioAppShellLayout } from '@lssm/bundle.contractspec-studio/presentation/components';

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StudioAppShellLayout>{children}</StudioAppShellLayout>;
}
