import * as React from 'react';
import { LegalPageLayout } from '../organisms/LegalPageLayout';
import { LegalSection } from '../atoms/LegalSection';
import { LegalHeading } from '../atoms/LegalHeading';
import { LegalText } from '../atoms/LegalText';
import { DefinitionList } from '../atoms/DefinitionList';

export function PrivacyTemplate({
  title = 'Politique de Confidentialité',
  meta,
  toc,
  sections,
  definitions,
}: {
  title?: React.ReactNode;
  meta?: { lastUpdated?: string | Date; version?: string };
  toc?: { href: string; label: React.ReactNode }[];
  sections: { id: string; title: React.ReactNode; content: React.ReactNode }[];
  definitions?: { term: React.ReactNode; description: React.ReactNode }[];
}) {
  return (
    <LegalPageLayout title={title} meta={meta} toc={toc}>
      {definitions && definitions.length > 0 && (
        <LegalSection border="bottom">
          <LegalHeading as="h2" level="h3">
            Définitions
          </LegalHeading>
          <DefinitionList items={definitions} />
        </LegalSection>
      )}

      {sections.map((s) => (
        <LegalSection
          key={s.id}
          id={s.id}
          border="top"
          className="scroll-mt-24"
        >
          <LegalHeading as="h2" level="h2">
            {s.title}
          </LegalHeading>
          <LegalText as="div">{s.content}</LegalText>
        </LegalSection>
      ))}
    </LegalPageLayout>
  );
}
