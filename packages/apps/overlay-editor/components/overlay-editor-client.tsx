'use client';

import { useActionState, useMemo, useState } from 'react';
import type { OverlayModification } from '@lssm/lib.overlay-engine';
import { defineOverlay, type OverlaySpec } from '@lssm/lib.overlay-engine';
import { signOverlayFromForm } from '../lib/sign-overlay';

interface FieldState {
  key: string;
  label: string;
  originalLabel: string;
  visible: boolean;
}

const DEFAULT_FIELDS: FieldState[] = [
  {
    key: 'customerReference',
    label: 'Customer Reference',
    originalLabel: 'Customer Reference',
    visible: true,
  },
  {
    key: 'items',
    label: 'Items',
    originalLabel: 'Items',
    visible: true,
  },
  {
    key: 'internalNotes',
    label: 'Internal Notes',
    originalLabel: 'Internal Notes',
    visible: true,
  },
  {
    key: 'paymentMethod',
    label: 'Payment Method',
    originalLabel: 'Payment Method',
    visible: true,
  },
];

export function OverlayEditorClient() {
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [overlayId, setOverlayId] = useState('tenant-overlay');
  const [tenantId, setTenantId] = useState('acme-corp');
  const [capability, setCapability] = useState('billing.createOrder');
  const [version, setVersion] = useState('1.0.0');

  const [signState, signAction, isPending] = useActionState(
    signOverlayFromForm,
    {
      signed: null as OverlaySpec | null,
      error: null as string | null,
    }
  );

  const overlaySpec = useMemo(() => {
    const modifications: OverlayModification[] = [];
    const hidden = fields
      .filter((field) => !field.visible)
      .map((field) => field.key);
    hidden.forEach((field) => {
      modifications.push({
        type: 'hideField',
        field,
        reason: 'Hidden from UI via overlay editor',
      });
    });

    const renamed = fields.filter(
      (field) => field.label !== field.originalLabel
    );
    renamed.forEach((field) => {
      modifications.push({
        type: 'renameLabel',
        field: field.key,
        newLabel: field.label,
      });
    });

    const currentOrder = fields.map((field) => field.key);
    const originalOrder = DEFAULT_FIELDS.map((field) => field.key);
    if (!arraysEqual(currentOrder, originalOrder)) {
      modifications.push({
        type: 'reorderFields',
        fields: currentOrder,
      });
    }

    return defineOverlay({
      overlayId,
      version,
      appliesTo: {
        capability,
        tenantId,
      },
      modifications,
      metadata: {
        previewFields: currentOrder.length,
      },
    });
  }, [fields, overlayId, version, capability, tenantId]);

  const overlayJson = useMemo(
    () => JSON.stringify(overlaySpec, null, 2),
    [overlaySpec]
  );
  const signedJson = useMemo(
    () => (signState?.signed ? JSON.stringify(signState.signed, null, 2) : ''),
    [signState]
  );

  return (
    <div className="editor-grid">
      <section>
        <h2>Overlay Details</h2>
        <label>
          Overlay ID
          <input
            value={overlayId}
            onChange={(event) => setOverlayId(event.target.value)}
          />
        </label>
        <label>
          Tenant ID
          <input
            value={tenantId}
            onChange={(event) => setTenantId(event.target.value)}
          />
        </label>
        <label>
          Capability
          <input
            value={capability}
            onChange={(event) => setCapability(event.target.value)}
          />
        </label>
        <label>
          Version
          <input
            value={version}
            onChange={(event) => setVersion(event.target.value)}
          />
        </label>
      </section>

      <section>
        <h2>Fields</h2>
        <div className="fields-list">
          {fields.map((field, index) => (
            <div key={field.key} className="field-row">
              <div className="field-row__meta">
                <strong>{field.key}</strong>
                <input
                  value={field.label}
                  onChange={(event) =>
                    updateLabel(index, event.target.value, setFields)
                  }
                />
              </div>
              <div className="field-row__actions">
                <button
                  type="button"
                  onClick={() => moveField(index, index - 1, setFields)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveField(index, index + 1, setFields)}
                >
                  ↓
                </button>
                <label>
                  <input
                    type="checkbox"
                    checked={field.visible}
                    onChange={() => toggleVisibility(index, setFields)}
                  />
                  Visible
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Overlay JSON</h2>
        <textarea readOnly value={overlayJson} />
      </section>

      <section>
        <h2>Sign Overlay</h2>
        <form action={signAction}>
          <input type="hidden" name="overlay" value={overlayJson} />
          <label>
            Private key (PEM)
            <textarea
              name="privateKey"
              placeholder="-----BEGIN PRIVATE KEY-----"
            />
          </label>
          <button type="submit" disabled={isPending}>
            {isPending ? 'Signing...' : 'Sign overlay'}
          </button>
        </form>
        {signState?.error && <p className="error">{signState.error}</p>}
        {signedJson && (
          <>
            <h3>Signed payload</h3>
            <textarea readOnly value={signedJson} />
          </>
        )}
      </section>
    </div>
  );
}

function toggleVisibility(
  index: number,
  setter: (fn: (prev: FieldState[]) => FieldState[]) => void
) {
  setter((prev) =>
    prev.map((field, idx) =>
      idx === index
        ? {
            ...field,
            visible: !field.visible,
          }
        : field
    )
  );
}

function moveField(
  from: number,
  to: number,
  setter: (fn: (prev: FieldState[]) => FieldState[]) => void
) {
  setter((prev) => {
    if (to < 0 || to >= prev.length) {
      return prev;
    }
    const copy = [...prev];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  });
}

function updateLabel(
  index: number,
  label: string,
  setter: (fn: (prev: FieldState[]) => FieldState[]) => void
) {
  setter((prev) =>
    prev.map((field, idx) =>
      idx === index
        ? {
            ...field,
            label,
          }
        : field
    )
  );
}

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}














