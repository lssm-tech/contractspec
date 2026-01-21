import type { Metadata } from 'next';
import { GuideCIDiffGatingPage } from '@contractspec/bundle.library';

export const metadata: Metadata = {
  title: 'CI Gating - ContractSpec Guides',
  description:
    'Add ContractSpec CI checks for deterministic diffs, drift detection, and breaking change gates.',
  alternates: {
    canonical:
      'https://www.contractspec.io/docs/guides/ci-contract-diff-gating',
  },
};

export default GuideCIDiffGatingPage;
