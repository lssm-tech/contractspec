import * as React from 'react';
import { MarketingSection } from '@lssm/lib.design-system';
import { HStack, VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@lssm/lib.ui-kit-web/ui/typography';
import { CheckCircle } from 'lucide-react';
import { ButtonLink } from '@lssm/lib.design-system';
import { Box } from '@lssm/lib.ui-kit-web/ui/stack';

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

function BulletList({ items }: { items: string[] }) {
  return (
    <VStack as="ul" gap="sm" className="list-none p-0">
      {items.map((item) => (
        <HStack as="li" key={item} gap="sm" align="start">
          <CheckCircle size={20} className="text-violet-400 flex-shrink-0" />
          <Muted className="text-sm leading-relaxed">{item}</Muted>
        </HStack>
      ))}
    </VStack>
  );
}

export function DevelopersSection() {
  return (
    <MarketingSection
      tone="muted"
      title="Built for developers"
      padding="comfortable"
      align="center"
    >
      <HStack gap="2xl" align="start" justify="center" className="mt-6 flex-wrap">
        <VStack gap="md" className="max-w-md">
          <Small className="text-xl font-semibold">Standard Tech Stack</Small>
          <BulletList items={standardTech} />
        </VStack>
        <VStack gap="md" className="max-w-md">
          <Small className="text-xl font-semibold">No Magic, No Lock-in</Small>
          <BulletList items={noMagic} />
        </VStack>
      </HStack>
      <Box className="mt-8">
        <ButtonLink href="/docs">
          Read the docs <span aria-hidden>→</span>
        </ButtonLink>
      </Box>
    </MarketingSection>
  );
}
