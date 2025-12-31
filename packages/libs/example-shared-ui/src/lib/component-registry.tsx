'use client';

import React, { useState, useEffect } from 'react';
import type { TemplateId } from './types';

export interface TemplateComponentRegistration {
  list: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  detail: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  form?: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export class TemplateComponentRegistry {
  private readonly components = new Map<
    TemplateId,
    TemplateComponentRegistration
  >();
  private readonly listeners = new Set<(templateId: TemplateId) => void>();

  register(
    templateId: TemplateId,
    registration: TemplateComponentRegistration
  ) {
    this.components.set(templateId, registration);
    this.listeners.forEach((l) => l(templateId));
  }

  get(templateId: TemplateId) {
    return this.components.get(templateId);
  }

  subscribe(listener: (templateId: TemplateId) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const templateComponentRegistry = new TemplateComponentRegistry();

export function registerTemplateComponents(
  templateId: TemplateId,
  components: TemplateComponentRegistration
) {
  templateComponentRegistry.register(templateId, components);
}

export function useTemplateComponents(
  templateId: TemplateId
): TemplateComponentRegistration | undefined {
  const [components, setComponents] = useState(() =>
    templateComponentRegistry.get(templateId)
  );

  useEffect(() => {
    return templateComponentRegistry.subscribe((updatedId) => {
      if (updatedId === templateId) {
        setComponents(templateComponentRegistry.get(templateId));
      }
    });
  }, [templateId]);

  return components;
}
