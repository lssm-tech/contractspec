import * as React from 'react';
import {
  MarketingCard,
  MarketingCardContent,
  MarketingCardHeader,
  MarketingCardTitle,
  MarketingCardsSection,
} from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';

const audiences = [
  {
    tier: 'Tier 1: Priority',
    title: 'AI-Native Startups & Technical Founders',
    body: 'Solo founders or small teams using Cursor, Copilot, Claude, or AI agents heavily. Messy AI-generated backends and frontends, inconsistent APIs, code that is hard to refactor.',
    need: 'Need: A way to stabilize AI-generated code without rewriting it.',
  },
  {
    tier: 'Tier 1: Priority',
    title: 'Small Teams with AI-Generated Chaos',
    body: '2-10 person teams that shipped fast with AI and now have tech debt. Multiple surfaces out of sync, no source of truth, afraid to touch AI-generated code.',
    need: 'Need: Incremental stabilization, safe regeneration, contracts as guardrails.',
  },
  {
    tier: 'Tier 2: Growth',
    title: 'AI Dev Agencies',
    body: 'Agencies building many projects for clients using AI-assisted development. Repeating the same patterns, inconsistent quality across projects, handoff nightmares.',
    need: 'Need: Reusable templates, consistent contracts, professional handoff artifacts.',
  },
  {
    tier: 'Tier 2: Growth',
    title: 'Scaleups with Compliance Needs',
    body: "Growing companies that need audit trails, API governance, or regulatory compliance. AI-generated code doesn't meet compliance requirements.",
    need: 'Need: Governance layer, change tracking, contract enforcement.',
  },
];

export function AudienceSection() {
  return (
    <MarketingCardsSection
      tone="default"
      columns={2}
      eyebrow="Who It's For"
      title="Built for teams drowning in AI-generated code"
      maxWidth="xl"
    >
      {audiences.map((item) => (
        <MarketingCard key={item.title} tone="muted">
          <MarketingCardHeader className="space-y-2">
            <Small className="font-semibold text-blue-400">{item.tier}</Small>
            <MarketingCardTitle className="text-xl">
              {item.title}
            </MarketingCardTitle>
          </MarketingCardHeader>
          <MarketingCardContent>
            <VStack gap="sm">
              <Muted className="text-sm leading-relaxed">{item.body}</Muted>
              <Small className="font-medium text-violet-400">{item.need}</Small>
            </VStack>
          </MarketingCardContent>
        </MarketingCard>
      ))}
    </MarketingCardsSection>
  );
}
