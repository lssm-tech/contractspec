import type React from 'react';
import StudioHeader from '@/components/studio/header';
import StudioFooter from '@/components/studio/footer';

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StudioHeader />
      {children}
      <StudioFooter />
    </>
  );
}
