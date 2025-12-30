'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  ButtonLink,
  Input,
  MarketingCard,
  MarketingCardContent,
  MarketingCardDescription,
  MarketingCardHeader,
  MarketingCardTitle,
  MarketingSection,
} from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
  listTemplates,
  type TemplateDefinition,
} from '@contractspec/bundle.library/lib/registry';

function matchesQuery(t: TemplateDefinition, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay =
    `${t.id} ${t.name} ${t.description} ${t.tags.join(' ')}`.toLowerCase();
  return hay.includes(q);
}

export function TemplatesMarketingPage() {
  const [query, setQuery] = useState('');

  const templates = useMemo(() => listTemplates(), []);
  const filtered = useMemo(
    () => templates.filter((t) => matchesQuery(t, query)),
    [templates, query]
  );

  return (
    <>
      <MarketingSection tone="default">
        <VStack as="header" gap="lg" align="center">
          <VStack gap="sm" align="center">
            <ButtonLink href="/docs" variant="ghost">
              Docs
            </ButtonLink>
            <ButtonLink href="/sandbox" variant="ghost">
              Open Sandbox
            </ButtonLink>
          </VStack>
          <VStack gap="sm" align="center">
            <ButtonLink href="/templates" variant="default">
              Templates
            </ButtonLink>
          </VStack>
        </VStack>
      </MarketingSection>

      <MarketingSection tone="muted">
        <VStack gap="lg">
          <VStack gap="sm">
            <ButtonLink href="/templates" variant="ghost">
              Browse all examples
            </ButtonLink>
          </VStack>
          <HStack gap="md" align="center" justify="between" wrap="wrap">
            <Input
              aria-label="Search templates and examples"
              placeholder="Search templates and examples…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </HStack>
        </VStack>
      </MarketingSection>

      <MarketingSection tone="default">
        <VStack gap="lg">
          <HStack gap="md" wrap="wrap">
            {filtered.map((t) => (
              <MarketingCard
                key={t.id}
                className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <MarketingCardHeader>
                  <MarketingCardTitle>
                    {t.icon} {t.name}
                  </MarketingCardTitle>
                  <MarketingCardDescription>
                    {t.description}
                  </MarketingCardDescription>
                </MarketingCardHeader>
                <MarketingCardContent>
                  <VStack gap="md">
                    <HStack gap="sm" wrap="wrap">
                      {t.tags.slice(0, 6).map((tag) => (
                        <ButtonLink
                          key={`${t.id}-${tag}`}
                          href={`/templates?tag=${encodeURIComponent(tag)}`}
                          variant="ghost"
                        >
                          {tag}
                        </ButtonLink>
                      ))}
                    </HStack>
                    <HStack gap="sm" justify="between" wrap="wrap">
                      <ButtonLinkToSandbox templateId={t.id} />
                      <Button variant="outline" onClick={() => void 0} disabled>
                        Install to Studio (soon)
                      </Button>
                    </HStack>
                  </VStack>
                </MarketingCardContent>
              </MarketingCard>
            ))}
          </HStack>
        </VStack>
      </MarketingSection>
    </>
  );
}

function ButtonLinkToSandbox({ templateId }: { templateId: string }) {
  return (
    <ButtonLink
      href={`/sandbox?template=${encodeURIComponent(templateId)}`}
      variant="default"
    >
      Preview
    </ButtonLink>
  );
}
