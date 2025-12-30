import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'ContractSpec Studio',
  description:
    'Workspace-first Studio: manage projects and open modules for canvas, specs, deploy, integrations, and evolution.',
  alternates: {
    canonical: 'https://contractspec.studio',
  },
};

export default function StudioPage() {
  redirect('/studio/projects');
}
