'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { StudioProjectSettings } from '@contractspec/bundle.studio/presentation/components/studio';

export default function SettingsPage() {
  const params = useParams<{ projectSlug: string }>();

  return (
    <div className="p-8">
      <StudioProjectSettings projectSlug={params.projectSlug} />
    </div>
  );
}
