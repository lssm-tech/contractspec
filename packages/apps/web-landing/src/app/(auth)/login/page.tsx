import type { Metadata } from 'next';
import LoginPageClient from './login-client';

export const metadata: Metadata = {
  title: 'Sign In: ContractSpec',
  description: 'Sign in to your ContractSpec account.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Sign In: ContractSpec',
    description: 'Sign in to ContractSpec.',
    url: 'https://contractspec.lssm.tech/login',
  },
  alternates: {
    canonical: 'https://contractspec.lssm.tech/login',
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
