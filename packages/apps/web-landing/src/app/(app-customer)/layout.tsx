import type React from 'react';
import { AuthProvider } from '@lssm/bundle.contractspec-studio/presentation/providers/auth';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider>{children}</AuthProvider>;
}
