/**
 * Widget registry for surface runtime.
 * Aligns with 09_extension_and_override_model.md.
 *
 * Widgets are registered in code, never from AI prompts.
 * Trust tiers: core | workspace | signed-plugin (never ephemeral-ai).
 */

export type WidgetTrust = 'core' | 'workspace' | 'signed-plugin';

export interface WidgetRegistryEntry {
	widgetKey: string;
	title: string;
	nodeKind: 'custom-widget';
	render: string;
	configure?: string;
	trust: WidgetTrust;
	requiresCapabilities?: string[];
	supportedSlots?: string[];
}

/** Rejects ephemeral-ai; widgets must be registered from code. */
function validateTrust(trust: string): asserts trust is WidgetTrust {
	if (trust === 'ephemeral-ai') {
		throw new Error(
			'Widgets cannot be registered with ephemeral-ai trust. Registration is a code/package concern.'
		);
	}
	if (trust !== 'core' && trust !== 'workspace' && trust !== 'signed-plugin') {
		throw new Error(`Invalid widget trust: ${trust}`);
	}
}

export interface WidgetRegistry {
	register(entry: WidgetRegistryEntry): void;
	get(widgetKey: string): WidgetRegistryEntry | undefined;
	has(widgetKey: string): boolean;
	list(): WidgetRegistryEntry[];
	listByTrust(trust: WidgetTrust): WidgetRegistryEntry[];
}

export function createWidgetRegistry(): WidgetRegistry {
	const entries = new Map<string, WidgetRegistryEntry>();

	return {
		register(entry: WidgetRegistryEntry): void {
			validateTrust(entry.trust);
			if (entry.nodeKind !== 'custom-widget') {
				throw new Error(
					`Widget "${entry.widgetKey}" must have nodeKind "custom-widget"`
				);
			}
			entries.set(entry.widgetKey, entry);
		},
		get(widgetKey: string): WidgetRegistryEntry | undefined {
			return entries.get(widgetKey);
		},
		has(widgetKey: string): boolean {
			return entries.has(widgetKey);
		},
		list(): WidgetRegistryEntry[] {
			return Array.from(entries.values());
		},
		listByTrust(trust: WidgetTrust): WidgetRegistryEntry[] {
			return Array.from(entries.values()).filter((e) => e.trust === trust);
		},
	};
}
