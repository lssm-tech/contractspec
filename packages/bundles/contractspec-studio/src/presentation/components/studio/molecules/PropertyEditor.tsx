import * as React from 'react';
import type { ComponentNode } from '../../../../modules/visual-builder';
import { Button, Input } from '@lssm/lib.design-system';

export interface PropertyEditorProps {
  node?: ComponentNode | null;
  onChange?: (updates: Partial<ComponentNode>) => void;
}

function normalizeValue(raw: unknown): string {
  if (typeof raw === 'boolean') return raw ? 'true' : 'false';
  if (typeof raw === 'number') return String(raw);
  if (raw == null) return '';
  return String(raw);
}

export function PropertyEditor({ node, onChange }: PropertyEditorProps) {
  const [newPropName, setNewPropName] = React.useState('');

  if (!node) {
    return (
      <div className="border-border bg-card/40 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Select a component to edit its properties.
      </div>
    );
  }

  const handlePropChange = (key: string, value: string) => {
    let parsed: unknown = value;
    if (value === 'true' || value === 'false') {
      parsed = value === 'true';
    } else if (!Number.isNaN(Number(value)) && value.trim() !== '') {
      parsed = Number(value);
    }
    onChange?.({
      props: {
        ...(node.props ?? {}),
        [key]: parsed,
      },
    });
  };

  const removeProp = (key: string) => {
    const nextProps = { ...(node.props ?? {}) };
    delete nextProps[key];
    onChange?.({ props: nextProps });
  };

  const handleAddProp = () => {
    const trimmed = newPropName.trim();
    if (!trimmed) return;
    onChange?.({
      props: {
        ...(node.props ?? {}),
        [trimmed]: '',
      },
    });
    setNewPropName('');
  };

  const propEntries = Object.entries(node.props ?? {});

  return (
    <div className="border-border bg-card rounded-2xl border p-5 space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          {node.type}
        </p>
        <h3 className="text-2xl font-semibold">Component properties</h3>
        <p className="text-muted-foreground text-sm">
          Tweak props to change layout, labels, and behaviours.
        </p>
      </div>

      <div className="space-y-3">
        {propEntries.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            This component has no explicit props yet.
          </p>
        ) : (
          propEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col gap-2 rounded-xl border border-border p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium">{key}</label>
                <Button variant="ghost" size="sm" onClick={() => removeProp(key)}>
                  Remove
                </Button>
              </div>
              <Input
                value={normalizeValue(value)}
                onChange={(next) => handlePropChange(key, next)}
                placeholder="Value"
              />
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Add property</label>
        <div className="flex gap-2">
          <Input
            value={newPropName}
            onChange={setNewPropName}
            placeholder="propName"
            className="flex-1"
          />
          <Button onClick={handleAddProp}>Add</Button>
        </div>
      </div>
    </div>
  );
}









