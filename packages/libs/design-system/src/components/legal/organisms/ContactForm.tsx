import * as React from 'react';
import { ContactFields } from '../molecules/ContactFields';
import { Button } from '../../atoms/Button';

export function ContactForm({
  labels = { submit: 'Envoyer' },
  initialValue = { name: '', email: '', subject: '', message: '' },
  disabled,
  onSubmit,
}: {
  labels?: { submit: React.ReactNode };
  initialValue?: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  disabled?: boolean;
  onSubmit?: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => Promise<void> | void;
}) {
  const [value, setValue] = React.useState(initialValue);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <ContactFields
        value={value}
        onChange={setValue}
        disabled={disabled || loading}
      />
      <Button disabled={disabled || loading} type="submit">
        {loading ? 'Envoi…' : labels.submit}
      </Button>
    </form>
  );
}
