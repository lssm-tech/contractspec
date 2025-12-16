import type { Metadata } from 'next';
import TeamsClient from './teams-client';

export const metadata: Metadata = {
  title: 'Teams: ContractSpec Studio',
  robots: 'noindex, nofollow',
};

export default function TeamsPage() {
  return <TeamsClient />;
}






