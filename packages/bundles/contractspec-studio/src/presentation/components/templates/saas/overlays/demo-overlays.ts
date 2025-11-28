/**
 * Demo Overlay Definitions for SaaS Boilerplate
 *
 * These overlays customize the presentation for different contexts
 * (e.g., demo users, different subscription tiers).
 */

export interface OverlayDefinition {
  overlayId: string;
  version: string;
  description: string;
  appliesTo: {
    presentation?: string;
    role?: string;
    feature?: string;
    tier?: string;
  };
  modifications: Array<
    | { type: 'hideField'; field: string; reason?: string }
    | { type: 'renameLabel'; field: string; newLabel: string }
    | { type: 'addBadge'; position: string; label: string; variant?: string }
    | { type: 'setDefault'; field: string; value: unknown }
    | { type: 'setLimit'; field: string; max: number; message?: string }
  >;
}

/**
 * Free tier overlay - shows upgrade prompts and limits
 */
export const saasFreeUserOverlay: OverlayDefinition = {
  overlayId: 'saas-boilerplate.free-tier',
  version: '1.0.0',
  description: 'Shows limitations for free tier users',
  appliesTo: {
    feature: 'saas-boilerplate',
    tier: 'free',
  },
  modifications: [
    { type: 'setLimit', field: 'projects', max: 3, message: 'Upgrade to create more projects' },
    { type: 'hideField', field: 'advancedSettings', reason: 'Pro feature' },
    { type: 'addBadge', position: 'header', label: 'Free Plan', variant: 'default' },
  ],
};

/**
 * Demo user overlay
 */
export const saasDemoOverlay: OverlayDefinition = {
  overlayId: 'saas-boilerplate.demo-user',
  version: '1.0.0',
  description: 'Demo mode for SaaS boilerplate',
  appliesTo: {
    feature: 'saas-boilerplate',
    role: 'demo',
  },
  modifications: [
    { type: 'hideField', field: 'billingSection', reason: 'Demo users cannot access billing' },
    { type: 'hideField', field: 'deleteAccount', reason: 'Not available in demo' },
    { type: 'addBadge', position: 'header', label: 'Demo Mode', variant: 'warning' },
  ],
};

/**
 * All overlays for saas-boilerplate
 */
export const saasOverlays: OverlayDefinition[] = [saasFreeUserOverlay, saasDemoOverlay];

