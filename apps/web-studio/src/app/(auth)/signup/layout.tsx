import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account: ContractSpec',
  description:
    'Sign up for ContractSpec and start building policy-safe apps today.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Create Account: ContractSpec',
    description: 'Sign up for ContractSpec.',
    url: 'https://contractspec.studio/signup',
  },
  alternates: {
    canonical: 'https://contractspec.studio/signup',
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
