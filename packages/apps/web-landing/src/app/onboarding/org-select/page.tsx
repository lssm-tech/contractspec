import type { Metadata } from 'next';
import OrgSelectClient from './org-select-client';

export const metadata: Metadata = {
  title: 'Choose workspace · ContractSpec',
  description:
    'Pick or create a ContractSpec workspace to continue setting up Studio.',
  robots: 'noindex, nofollow',
};

export default function OrgSelectPage() {
  return <OrgSelectClient />;
}










