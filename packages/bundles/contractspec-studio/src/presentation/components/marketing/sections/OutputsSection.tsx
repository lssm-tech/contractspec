import * as React from 'react';
import {
  MarketingCard,
  MarketingCardContent,
  MarketingCardTitle,
  MarketingCardsSection,
} from '@lssm/lib.design-system';
import { Box, VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { Muted } from '@lssm/lib.ui-kit-web/ui/typography';

const outputs = [
  {
    title: 'REST API',
    description:
      'Type-safe endpoints with validation. Standard Express/Hono/Elysia handlers.',
    icon: '🔌',
  },
  {
    title: 'GraphQL Schema',
    description: 'Automatically generated resolvers. Standard Pothos/Apollo output.',
    icon: '📊',
  },
  {
    title: 'Database Schema',
    description: 'Prisma migrations and types. Standard SQL underneath.',
    icon: '🗄️',
  },
  {
    title: 'MCP Tools',
    description:
      'AI agent tool definitions. Works with Claude, GPT, and any MCP client.',
    icon: '🤖',
  },
  {
    title: 'Client SDKs',
    description: 'Type-safe API clients. Standard fetch/axios underneath.',
    icon: '📦',
  },
  {
    title: 'UI Components',
    description: 'React forms and views from specs. Standard JSX output.',
    icon: '🎨',
  },
];

export function OutputsSection() {
  return (
    <MarketingCardsSection
      tone="muted"
      columns={3}
      title="What ContractSpec generates"
      subtitle="One contract, multiple outputs. All in sync. All standard tech."
    >
      {outputs.map((item) => (
        <MarketingCard key={item.title} tone="default">
          <MarketingCardContent>
            <VStack gap="sm">
              <Box className="text-3xl" aria-hidden>
                {item.icon}
              </Box>
              <MarketingCardTitle className="text-lg">{item.title}</MarketingCardTitle>
              <Muted className="text-sm leading-relaxed">{item.description}</Muted>
            </VStack>
          </MarketingCardContent>
        </MarketingCard>
      ))}
    </MarketingCardsSection>
  );
}
