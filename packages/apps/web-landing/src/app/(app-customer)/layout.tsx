import type React from 'react';
import { AuthProvider } from '@lssm/bundle.contractspec-studio/presentation/providers/auth';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      {children}
      <Analytics />
    </AuthProvider>
  );
}
