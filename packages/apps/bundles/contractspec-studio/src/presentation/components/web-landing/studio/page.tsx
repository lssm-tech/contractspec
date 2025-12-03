import type { Metadata } from 'next';
import StudioExperienceClient from './StudioExperienceClient';

export const metadata: Metadata = {
  title: 'ContractSpec Studio – Live Preview',
  description:
    'Explore ContractSpec Studio in your browser: projects dashboard, visual canvas, spec editor, and deployment orchestration.',
  alternates: {
    canonical: 'https://contractspec.chaman.ventures/studio',
  },
};

export default function StudioPage() {
  return <StudioExperienceClient />;
}
