import * as React from 'react';
import { LegalHeading } from '../atoms/LegalHeading';
import { LegalList } from '../atoms/LegalList';
import { LegalSection } from '../atoms/LegalSection';

export function GDPRRights({
  title = 'Vos droits RGPD',
  rights = [
    'Accès à vos données',
    'Rectification',
    'Effacement (droit à l’oubli)',
    'Opposition et limitation',
    'Portabilité',
  ],
}: {
  title?: React.ReactNode;
  rights?: React.ReactNode[];
}) {
  return (
    <LegalSection border="top">
      <LegalHeading as="h2" level="h2">
        {title}
      </LegalHeading>
      <LegalList type="unordered">
        {rights.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </LegalList>
    </LegalSection>
  );
}
