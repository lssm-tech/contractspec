import type { Metadata } from 'next';
import StudioProjectsClient from './projects-client';

export const metadata: Metadata = {
  title: 'Studio Projects – ContractSpec',
  alternates: {
    canonical: 'https://contractspec.lssm.tech/studio/projects',
  },
};

export default function StudioProjectsPage() {
  return <StudioProjectsClient />;
}






