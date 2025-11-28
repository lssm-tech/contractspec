/**
 * Demo Overlay Definitions for Agent Console
 *
 * These overlays customize the presentation for different contexts
 * (e.g., demo users, different roles).
 */

export interface OverlayDefinition {
  overlayId: string;
  version: string;
  description: string;
  appliesTo: {
    presentation?: string;
    role?: string;
    feature?: string;
  };
  modifications: Array<
    | { type: 'hideField'; field: string; reason?: string }
    | { type: 'renameLabel'; field: string; newLabel: string }
    | { type: 'addBadge'; position: string; label: string; variant?: string }
    | { type: 'setDefault'; field: string; value: unknown }
  >;
}

/**
 * Demo user overlay - hides advanced configuration options
 */
export const agentConsoleDemoOverlay: OverlayDefinition = {
  overlayId: 'agent-console.demo-user',
  version: '1.0.0',
  description: 'Simplifies agent console for demo users',
  appliesTo: {
    feature: 'agent-console',
    role: 'demo',
  },
  modifications: [
    { type: 'hideField', field: 'modelConfig', reason: 'Advanced config not relevant for demo' },
    { type: 'hideField', field: 'webhookConfig', reason: 'Integration not available in demo' },
    { type: 'renameLabel', field: 'systemPrompt', newLabel: 'Agent Instructions' },
    { type: 'addBadge', position: 'header', label: 'Demo Mode', variant: 'warning' },
  ],
};

/**
 * Read-only overlay - for viewing without edit permissions
 */
export const agentConsoleReadOnlyOverlay: OverlayDefinition = {
  overlayId: 'agent-console.read-only',
  version: '1.0.0',
  description: 'Read-only view for non-admin users',
  appliesTo: {
    feature: 'agent-console',
    role: 'viewer',
  },
  modifications: [
    { type: 'hideField', field: 'deleteButton', reason: 'No delete permission' },
    { type: 'hideField', field: 'editButton', reason: 'No edit permission' },
    { type: 'hideField', field: 'createButton', reason: 'No create permission' },
  ],
};

/**
 * All overlays for agent-console
 */
export const agentConsoleOverlays: OverlayDefinition[] = [
  agentConsoleDemoOverlay,
  agentConsoleReadOnlyOverlay,
];

