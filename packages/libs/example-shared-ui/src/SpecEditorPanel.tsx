'use client';

import { useCallback, useEffect } from 'react';
import { Button, LoaderBlock } from '@contractspec/lib.design-system';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import type { TemplateId } from './lib/types';
import { useSpecContent } from './hooks/useSpecContent';

export interface SpecEditorProps {
  projectId: string;
  type?: 'CAPABILITY' | 'DATAVIEW' | 'WORKFLOW' | 'POLICY' | 'COMPONENT';
  content: string;
  onChange: (content: string) => void;
  metadata?: Record<string, unknown>;
  onSave?: () => void;
  onValidate?: () => void;
}

export interface SpecEditorPanelProps {
  templateId: TemplateId;
  /** SpecEditor component passed as a prop (for dynamic import compatibility) */
  SpecEditor: React.ComponentType<SpecEditorProps>;
  /** Callback for logging actions */
  onLog?: (message: string) => void;
}

/**
 * Spec editor panel that wraps SpecEditor with persisted spec content.
 * Uses useSpecContent hook to manage spec persistence and validation.
 */
export function SpecEditorPanel({
  templateId,
  SpecEditor,
  onLog,
}: SpecEditorPanelProps) {
  const {
    content,
    loading,
    isDirty,
    validation,
    setContent,
    save,
    validate,
    reset,
    lastSaved,
  } = useSpecContent(templateId);

  // Log when spec is loaded
  useEffect(() => {
    if (!loading && content) {
      onLog?.(`Spec loaded for ${templateId}`);
    }
  }, [loading, content, templateId, onLog]);

  const handleSave = useCallback(() => {
    save();
    onLog?.('Spec saved locally');
  }, [save, onLog]);

  const handleValidate = useCallback(() => {
    const result = validate();
    if (result.valid) {
      onLog?.('Spec validation passed');
    } else {
      const errorCount = result.errors.filter(
        (e) => e.severity === 'error'
      ).length;
      const warnCount = result.errors.filter(
        (e) => e.severity === 'warning'
      ).length;
      onLog?.(`Spec validation: ${errorCount} errors, ${warnCount} warnings`);
    }
  }, [validate, onLog]);

  const handleReset = useCallback(() => {
    reset();
    onLog?.('Spec reset to template defaults');
  }, [reset, onLog]);

  if (loading) {
    return <LoaderBlock label="Loading spec..." />;
  }

  return (
    <div className="space-y-4">
      {/* Spec Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleValidate}>
            Validate
          </Button>
          {isDirty && (
            <Badge
              variant="secondary"
              className="border-amber-500/30 bg-amber-500/20 text-amber-400"
            >
              Unsaved changes
            </Badge>
          )}
          {validation && (
            <Badge
              variant={validation.valid ? 'default' : 'destructive'}
              className={
                validation.valid
                  ? 'border-green-500/30 bg-green-500/20 text-green-400'
                  : ''
              }
            >
              {validation.valid
                ? 'Valid'
                : `${validation.errors.filter((e) => e.severity === 'error').length} errors`}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-muted-foreground text-xs">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
          <Button variant="ghost" size="sm" onPress={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validation && validation.errors.length > 0 && (
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
          <p className="mb-2 text-xs font-semibold text-amber-400 uppercase">
            Validation Issues
          </p>
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <li
                key={`${error.line}-${error.message}-${index}`}
                className={`text-xs ${
                  error.severity === 'error' ? 'text-red-400' : 'text-amber-400'
                }`}
              >
                Line {error.line}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor */}
      <div className="border-border bg-card rounded-2xl border p-4">
        <SpecEditor
          projectId="sandbox"
          type="CAPABILITY"
          content={content}
          onChange={setContent}
          metadata={{ template: templateId }}
          onSave={handleSave}
          onValidate={handleValidate}
        />
      </div>
    </div>
  );
}
