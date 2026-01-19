import { ChangelogPage } from '@contractspec/bundle.marketing/components/marketing/ChangelogPage';
import { getAggregatedChangelog } from '@/lib/changelog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog | ContractSpec',
  description:
    'Latest updates, improvements, and fixes to the ContractSpec platform.',
  openGraph: {
    title: 'Changelog | ContractSpec',
    description:
      'Latest updates, improvements, and fixes to the ContractSpec platform.',
    url: 'https://www.contractspec.io/changelog',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/changelog',
  },
};

export default async function Page() {
  const entries = await getAggregatedChangelog();
  return <ChangelogPage entries={entries} />;
}
