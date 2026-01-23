import { ContactClient } from '@contractspec/bundle.marketing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | ContractSpec',
  description:
    "Get in touch with the ContractSpec team. We're here to help you stabilize your AI-generated code and build better software.",
  keywords: [
    'contact',
    'support',
    'help',
    'ContractSpec team',
    'AI code stabilization',
    'spec-first development',
  ],
  openGraph: {
    title: 'Contact Us | ContractSpec',
    description:
      "Get in touch with the ContractSpec team. We're here to help you stabilize your AI-generated code and build better software.",
    url: 'https://www.contractspec.io/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | ContractSpec',
    description:
      "Get in touch with the ContractSpec team. We're here to help you stabilize your AI-generated code.",
  },
  alternates: {
    canonical: 'https://www.contractspec.io/contact',
  },
};

export default ContactClient;
