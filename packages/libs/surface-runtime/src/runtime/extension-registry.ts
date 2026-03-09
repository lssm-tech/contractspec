/**
 * Action and command registries for surface runtime.
 * Aligns with 09_extension_and_override_model.md.
 *
 * BundleExtensionRegistry: registerWidget, registerFieldRenderer, registerAction, registerCommand.
 */

import type { ActionSpec, CommandSpec } from '../spec/types';
import type { WidgetRegistryEntry } from './widget-registry';
import type { FieldRendererSpec } from '../spec/types';
import type { MutableFieldRendererRegistry } from './field-renderer-registry';

export interface BundleExtensionRegistry {
  registerWidget(entry: WidgetRegistryEntry): void;
  registerFieldRenderer(kind: string, entry: FieldRendererSpec): void;
  registerAction(entry: ActionSpec): void;
  registerCommand(entry: CommandSpec): void;
}

export interface ActionRegistry {
  register(entry: ActionSpec): void;
  get(actionId: string): ActionSpec | undefined;
  has(actionId: string): boolean;
  list(): ActionSpec[];
}

export interface CommandRegistry {
  register(entry: CommandSpec): void;
  get(commandId: string): CommandSpec | undefined;
  has(commandId: string): boolean;
  list(): CommandSpec[];
}

export function createActionRegistry(): ActionRegistry {
  const entries = new Map<string, ActionSpec>();
  return {
    register(entry: ActionSpec): void {
      entries.set(entry.actionId, entry);
    },
    get(actionId: string): ActionSpec | undefined {
      return entries.get(actionId);
    },
    has(actionId: string): boolean {
      return entries.has(actionId);
    },
    list(): ActionSpec[] {
      return Array.from(entries.values());
    },
  };
}

export function createCommandRegistry(): CommandRegistry {
  const entries = new Map<string, CommandSpec>();
  return {
    register(entry: CommandSpec): void {
      entries.set(entry.commandId, entry);
    },
    get(commandId: string): CommandSpec | undefined {
      return entries.get(commandId);
    },
    has(commandId: string): boolean {
      return entries.has(commandId);
    },
    list(): CommandSpec[] {
      return Array.from(entries.values());
    },
  };
}

export interface CreateBundleExtensionRegistryOptions {
  widgetRegistry: { register(entry: WidgetRegistryEntry): void };
  fieldRendererRegistry: MutableFieldRendererRegistry;
  actionRegistry?: ActionRegistry;
  commandRegistry?: CommandRegistry;
}

export function createBundleExtensionRegistry(
  options: CreateBundleExtensionRegistryOptions
): BundleExtensionRegistry {
  const actionRegistry = options.actionRegistry ?? createActionRegistry();
  const commandRegistry = options.commandRegistry ?? createCommandRegistry();

  return {
    registerWidget(entry: WidgetRegistryEntry): void {
      options.widgetRegistry.register(entry);
    },
    registerFieldRenderer(kind: string, entry: FieldRendererSpec): void {
      options.fieldRendererRegistry.registerFieldRenderer(kind, entry);
    },
    registerAction(entry: ActionSpec): void {
      actionRegistry.register(entry);
    },
    registerCommand(entry: CommandSpec): void {
      commandRegistry.register(entry);
    },
  };
}
