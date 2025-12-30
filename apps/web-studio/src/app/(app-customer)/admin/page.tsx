import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { assertsPlatformAdmin } from '@contractspec/bundle.studio/application/services/auth';

import StudioAdminClient from './admin-client';

export const metadata: Metadata = {
  title: 'Platform Admin – ContractSpec Studio',
  alternates: {
    canonical: 'https://contractspec.studio/admin',
  },
};

export default async function StudioAdminPage() {
  try {
    await assertsPlatformAdmin();
  } catch {
    redirect('/studio/projects');
  }

  return <StudioAdminClient />;
}
