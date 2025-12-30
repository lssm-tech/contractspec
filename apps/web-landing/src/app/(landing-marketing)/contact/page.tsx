import type { Metadata } from 'next';
import ContactClient from './contactClient';

export const metadata: Metadata = {
  title: 'Contact Us: ContractSpec',
  description:
    'Book a 15-minute call with our team to learn more about ContractSpec.',
  openGraph: {
    title: 'Contact Us: ContractSpec',
    description: 'Schedule a call with our team.',
    url: 'https://contractspec.io/contact',
  },
  alternates: {
    canonical: 'https://contractspec.io/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
