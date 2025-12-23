import * as React from 'react';
import { Input } from '../../atoms/Input';
import { Textarea } from '../../atoms/Textarea';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';

export function ContactFields({
  value,
  onChange,
  disabled,
}: {
  value: { name: string; email: string; subject: string; message: string };
  onChange: (next: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nom</Label>
        <Input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label>Objet</Label>
        <Input
          value={value.subject}
          onChange={(e) =>
            onChange({
              ...value,
              subject: e.target.value,
            })
          }
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea
          value={value.message}
          onChange={(e) =>
            onChange({
              ...value,
              message: e.target.value,
            })
          }
          disabled={disabled}
          rows={6}
        />
      </div>
    </div>
  );
}
