import * as React from 'react';
import {
  ButtonLink,
  MarketingComparisonSection,
} from '@contractspec/lib.design-system';

const standardTech = [
  'TypeScript & Zod — schemas you already know',
  'Prisma — standard database access',
  'GraphQL or REST — your choice',
  'React or any UI framework',
  'Bun, Node, Deno — all supported',
];

const noMagic = [
  'Generated code is readable & modifiable',
  'No proprietary runtime dependencies',
  'Eject anytime, keep everything',
  'Works with your existing CI/CD',
  'Open spec format',
];

export function DevelopersSection() {
  return (
    <MarketingComparisonSection
      tone="muted"
      title="Built for developers"
      padding="comfortable"
      left={{ title: 'Standard Tech Stack', items: standardTech }}
      right={{ title: 'No Magic, No Lock-in', items: noMagic }}
      subtitle={
        <ButtonLink href="/docs">
          Read the docs <span aria-hidden>→</span>
        </ButtonLink>
      }
    />
  );
}
