'use client';

import type React from 'react';

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex grow flex-col items-center justify-center pt-24">
      {children}
    </main>
  );
}
