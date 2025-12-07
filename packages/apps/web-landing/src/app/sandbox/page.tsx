import type { Metadata } from 'next';
import SandboxExperienceClient from './SandboxExperienceClient';

export const metadata: Metadata = {
  title: 'Sandbox – ContractSpec',
  description:
    'Explore templates, specs, and visual builder in your browser. Fully local runtime, no infrastructure required.',
  alternates: {
    canonical: 'https://contractspec.lssm.tech/sandbox',
  },
};

export default function SandboxPage() {
  return <SandboxExperienceClient />;
}
