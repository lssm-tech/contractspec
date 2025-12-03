'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TemplateId } from '../../../../../templates/registry';
import { generateSpecFromTemplate } from '../utils/generateSpecFromTemplate';

/**
 * Storage key prefix for spec content persistence
 */
const SPEC_STORAGE_KEY = 'contractspec-spec-content';

/**
 * Validation result for spec content
 */
export interface SpecValidationResult {
  valid: boolean;
  errors: {
    line: number;
    message: string;
    severity: 'error' | 'warning';
  }[];
}

/**
 * Hook return type
 */
export interface UseSpecContentReturn {
  /** Current spec content */
  content: string;
  /** Whether the spec is loading */
  loading: boolean;
  /** Whether the spec has unsaved changes */
  isDirty: boolean;
  /** Last validation result */
  validation: SpecValidationResult | null;
  /** Update spec content */
  setContent: (content: string) => void;
  /** Save spec content to storage */
  save: () => void;
  /** Validate spec content */
  validate: () => SpecValidationResult;
  /** Reset to template default */
  reset: () => void;
  /** Last saved timestamp */
  lastSaved: string | null;
}

/**
 * Hook for managing spec content with persistence for a template.
 * Uses localStorage for persistence in the sandbox environment.
 */
export function useSpecContent(templateId: TemplateId): UseSpecContentReturn {
  const [content, setContentState] = useState<string>('');
  const [savedContent, setSavedContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [validation, setValidation] = useState<SpecValidationResult | null>(
    null
  );
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load spec content from storage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(`${SPEC_STORAGE_KEY}-${templateId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          content: string;
          savedAt: string;
        };
        if (parsed.content) {
          setContentState(parsed.content);
          setSavedContent(parsed.content);
          setLastSaved(parsed.savedAt);
        } else {
          // Invalid stored state, generate from template
          const generated = generateSpecFromTemplate(templateId);
          setContentState(generated);
          setSavedContent(generated);
        }
      } else {
        // No stored state, generate from template
        const generated = generateSpecFromTemplate(templateId);
        setContentState(generated);
        setSavedContent(generated);
      }
    } catch {
      // On error, generate from template
      const generated = generateSpecFromTemplate(templateId);
      setContentState(generated);
      setSavedContent(generated);
    }
    setLoading(false);
  }, [templateId]);

  /**
   * Update spec content (in-memory only until save)
   */
  const setContent = useCallback((newContent: string): void => {
    setContentState(newContent);
    // Clear validation when content changes
    setValidation(null);
  }, []);

  /**
   * Save spec content to storage
   */
  const save = useCallback((): void => {
    try {
      const savedAt = new Date().toISOString();
      localStorage.setItem(
        `${SPEC_STORAGE_KEY}-${templateId}`,
        JSON.stringify({
          content,
          savedAt,
        })
      );
      setSavedContent(content);
      setLastSaved(savedAt);
    } catch {
      // Ignore storage errors
    }
  }, [content, templateId]);

  /**
   * Validate spec content
   * Performs basic syntax validation
   */
  const validate = useCallback((): SpecValidationResult => {
    const errors: SpecValidationResult['errors'] = [];

    // Basic validation rules
    const lines = content.split('\n');

    // Check for contractSpec function call
    if (!content.includes('contractSpec(')) {
      errors.push({
        line: 1,
        message: 'Spec must contain a contractSpec() definition',
        severity: 'error',
      });
    }

    // Check for required fields
    if (!content.includes('goal:')) {
      errors.push({
        line: 1,
        message: 'Spec should have a goal field',
        severity: 'warning',
      });
    }

    if (!content.includes('io:')) {
      errors.push({
        line: 1,
        message: 'Spec should define io (input/output)',
        severity: 'warning',
      });
    }

    // Check for balanced braces
    const openBraces = (content.match(/{/g) ?? []).length;
    const closeBraces = (content.match(/}/g) ?? []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        line: lines.length,
        message: `Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`,
        severity: 'error',
      });
    }

    // Check for balanced parentheses
    const openParens = (content.match(/\(/g) ?? []).length;
    const closeParens = (content.match(/\)/g) ?? []).length;
    if (openParens !== closeParens) {
      errors.push({
        line: lines.length,
        message: `Unbalanced parentheses: ${openParens} opening, ${closeParens} closing`,
        severity: 'error',
      });
    }

    // Check for unclosed strings (basic check)
    lines.forEach((line, index) => {
      const singleQuotes = (line.match(/'/g) ?? []).length;
      const doubleQuotes = (line.match(/"/g) ?? []).length;
      if (singleQuotes % 2 !== 0) {
        errors.push({
          line: index + 1,
          message: 'Unclosed single quote',
          severity: 'error',
        });
      }
      if (doubleQuotes % 2 !== 0) {
        errors.push({
          line: index + 1,
          message: 'Unclosed double quote',
          severity: 'error',
        });
      }
    });

    const result: SpecValidationResult = {
      valid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
    };

    setValidation(result);
    return result;
  }, [content]);

  /**
   * Reset to template default
   */
  const reset = useCallback((): void => {
    const generated = generateSpecFromTemplate(templateId);
    setContentState(generated);
    setSavedContent(generated);
    setValidation(null);
    setLastSaved(null);

    // Clear from storage
    try {
      localStorage.removeItem(`${SPEC_STORAGE_KEY}-${templateId}`);
    } catch {
      // Ignore storage errors
    }
  }, [templateId]);

  return {
    content,
    loading,
    isDirty: content !== savedContent,
    validation,
    setContent,
    save,
    validate,
    reset,
    lastSaved,
  };
}

