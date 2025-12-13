'use client';

import { useMemo, useState } from 'react';
import {
  Input,
  Button,
  ButtonLink,
  MarketingLayout,
  MarketingSection,
  Link as DsLink,
} from '@lssm/lib.design-system';
import { VStack, HStack } from '@lssm/lib.ui-kit-web/ui/stack';
import {
  MarketingCard,
  MarketingCardContent,
  MarketingCardDescription,
  MarketingCardHeader,
  MarketingCardTitle,
} from '@lssm/lib.design-system';
import {
  listTemplates,
  type TemplateDefinition,
} from '../../../templates/registry';

function matchesQuery(t: TemplateDefinition, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay =
    `${t.id} ${t.name} ${t.description} ${t.tags.join(' ')}`.toLowerCase();
  return hay.includes(q);
}

export function TemplatesPage() {
  const [query, setQuery] = useState('');

  const templates = useMemo(() => listTemplates(), []);
  const filtered = useMemo(
    () => templates.filter((t) => matchesQuery(t, query)),
    [templates, query]
  );

  return (
    <MarketingLayout>
      <MarketingSection tone="default">
        <VStack as="header" gap="lg" align="center">
          <VStack gap="sm" align="center">
            <DsLink href="/docs" variant="muted">
              Docs
            </DsLink>
            <DsLink href="/sandbox" variant="muted">
              Open Sandbox
            </DsLink>
          </VStack>
          <VStack gap="sm" align="center">
            <DsLink href="/templates" variant="primary">
              Templates
            </DsLink>
          </VStack>
        </VStack>
      </MarketingSection>

      <MarketingSection tone="muted">
        <VStack gap="lg">
          <VStack gap="sm">
            <DsLink href="/templates" variant="muted">
              Browse all examples
            </DsLink>
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
                        <DsLink
                          key={`${t.id}-${tag}`}
                          href={`/templates?tag=${encodeURIComponent(tag)}`}
                          variant="muted"
                        >
                          {tag}
                        </DsLink>
                      ))}
                    </HStack>
                    <HStack gap="sm" justify="between" wrap="wrap">
                      <ButtonLinkToSandbox templateId={t.id} />
                      <Button
                        variant="outline"
                        onPress={() => void 0}
                        isDisabled
                      >
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
    </MarketingLayout>
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
