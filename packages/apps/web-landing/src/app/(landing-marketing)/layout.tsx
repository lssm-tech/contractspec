import type React from 'react';
import { MarketingLayout } from '@lssm/lib.design-system';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MarketingLayout header={<Header />} footer={<Footer />}>
      {children}
      <Analytics />
    </MarketingLayout>
  );
}
