import * as React from 'react';
import { Button } from '../../atoms/Button';
import { LegalSection } from '../atoms/LegalSection';
import { LegalHeading } from '../atoms/LegalHeading';
import { LegalText } from '../atoms/LegalText';

export function GDPRDataRequest({
  onExport,
  onDelete,
  labels = { export: 'Demander une copie', delete: 'Demander la suppression' },
}: {
  onExport?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  labels?: { export: React.ReactNode; delete: React.ReactNode };
}) {
  const [loading, setLoading] = React.useState<'export' | 'delete' | null>(
    null
  );

  const handle = async (kind: 'export' | 'delete') => {
    const fn = kind === 'export' ? onExport : onDelete;
    if (!fn) return;
    setLoading(kind);
    try {
      await fn();
    } finally {
      setLoading(null);
    }
  };

  return (
    <LegalSection border="top" className="space-y-3">
      <LegalHeading as="h2" level="h2">
        Demandes de données
      </LegalHeading>
      <LegalText>
        Vous pouvez demander une copie de vos données ou solliciter leur
        suppression. Ces demandes nécessitent une vérification d’identité et
        sont traitées dans les délais légaux.
      </LegalText>
      <div className="flex flex-wrap gap-3">
        <Button onPress={() => handle('export')} disabled={loading !== null}>
          {loading === 'export' ? 'Envoi…' : labels.export}
        </Button>
        <Button
          variant="destructive"
          onPress={() => handle('delete')}
          disabled={loading !== null}
        >
          {loading === 'delete' ? 'Envoi…' : labels.delete}
        </Button>
      </div>
    </LegalSection>
  );
}
