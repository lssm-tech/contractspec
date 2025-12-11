import * as React from 'react';
import {
  MarketingCard,
  MarketingCardContent,
  MarketingCardsSection,
} from '@lssm/lib.design-system';
import { HStack, VStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@lssm/lib.ui-kit-web/ui/typography';
import { CheckCircle, Code, Unlock, Zap } from 'lucide-react';

const fears = [
  {
    title: '"I already have an app"',
    body:
      "ContractSpec works with existing codebases. You don't start over — you stabilize incrementally, one module at a time. Start with one API endpoint, one data model, one contract.",
    icon: CheckCircle,
  },
  {
    title: '"Vendor lock-in / losing ownership"',
    body:
      "You own the generated code. It's standard TypeScript, standard SQL, standard GraphQL. ContractSpec is a compiler — like TypeScript itself. You can eject anytime.",
    icon: Unlock,
  },
  {
    title: '"Adoption cost / learning curve"',
    body:
      'Specs are just TypeScript. If you can write z.object({ name: z.string() }), you can write a ContractSpec. No new language, no magic DSL, no YAML.',
    icon: Code,
  },
  {
    title: '"Forced migrations / magical runtime"',
    body:
      "ContractSpec generates plain code you can read, debug, and modify. There's no proprietary runtime. Migrations are explicit, reversible, and in your control.",
    icon: Zap,
  },
];

export function FearsSection() {
  return (
    <MarketingCardsSection
      tone="muted"
      columns={2}
      eyebrow="We Get It"
      title="Your fears, addressed"
      subtitle="We know what you're thinking. Here's why those concerns don't apply to ContractSpec."
    >
      {fears.map((item) => (
        <MarketingCard key={item.title} tone="muted">
          <MarketingCardContent>
            <HStack gap="md" align="start">
              <item.icon className="text-violet-400" size={24} />
              <VStack gap="xs">
                <Small className="text-violet-300 font-semibold">
                  {item.title}
                </Small>
                <Muted className="text-sm leading-relaxed">{item.body}</Muted>
              </VStack>
            </HStack>
          </MarketingCardContent>
        </MarketingCard>
      ))}
    </MarketingCardsSection>
  );
}
