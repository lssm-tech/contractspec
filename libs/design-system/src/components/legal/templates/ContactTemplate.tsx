import * as React from 'react';
import { LegalPageLayout } from '../organisms/LegalPageLayout';
import { ContactFields } from '../molecules/ContactFields';
import { Button } from '../../../index';

export function ContactTemplate({
  title = 'Contact',
  meta,
  onSubmit,
}: {
  title?: React.ReactNode;
  meta?: { lastUpdated?: string | Date; version?: string };
  onSubmit?: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => Promise<void> | void;
}) {
  const [value, setValue] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    setLoading(true);
    try {
      await onSubmit(value);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LegalPageLayout title={title} meta={meta}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ContactFields value={value} onChange={setValue} disabled={loading} />
        <Button disabled={loading} type="submit">
          {loading ? 'Envoi…' : 'Envoyer'}
        </Button>
      </form>
    </LegalPageLayout>
  );
}
