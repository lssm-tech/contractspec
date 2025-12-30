import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'ContractSpec Overlay Editor',
  description: 'Visual editor for OverlaySpecs with signing workflow.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
