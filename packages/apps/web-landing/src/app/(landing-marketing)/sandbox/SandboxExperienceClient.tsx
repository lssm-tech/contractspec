'use client';

import dynamic from 'next/dynamic';

const SandboxExperience = dynamic(
  () =>
    import('@lssm/bundle.contractspec-studio/presentation/components').then(
      (m) => m.SandboxExperienceClient
    ),
  { ssr: false }
);

export default function SandboxExperienceClient() {
  return <SandboxExperience />;
}


