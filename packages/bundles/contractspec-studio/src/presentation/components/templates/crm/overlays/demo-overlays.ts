/**
 * Demo Overlay Definitions for CRM Pipeline
 *
 * These overlays customize the presentation for different contexts
 * (e.g., demo users, different roles).
 */
import type { OverlayDefinition } from '../../shared/overlay-types';

/**
 * Demo user overlay - sample data mode
 */
export const crmDemoOverlay: OverlayDefinition = {
  overlayId: 'crm-pipeline.demo-user',
  version: '1.0.0',
  description: 'Demo mode with sample data',
  appliesTo: {
    feature: 'crm-pipeline',
    role: 'demo',
  },
  modifications: [
    {
      type: 'hideField',
      field: 'importButton',
      reason: 'Not available in demo',
    },
    {
      type: 'hideField',
      field: 'exportButton',
      reason: 'Not available in demo',
    },
    {
      type: 'addBadge',
      position: 'header',
      label: 'Demo Mode',
      variant: 'warning',
    },
  ],
};

/**
 * Sales rep overlay - focused view for sales
 */
export const crmSalesRepOverlay: OverlayDefinition = {
  overlayId: 'crm-pipeline.sales-rep',
  version: '1.0.0',
  description: 'Sales rep focused view',
  appliesTo: {
    feature: 'crm-pipeline',
    role: 'sales-rep',
  },
  modifications: [
    {
      type: 'hideField',
      field: 'teamMetrics',
      reason: 'Team metrics for managers only',
    },
    { type: 'hideField', field: 'pipelineSettings', reason: 'Admin only' },
    { type: 'renameLabel', field: 'deals', newLabel: 'My Deals' },
  ],
};

/**
 * All overlays for crm-pipeline
 */
export const crmOverlays: OverlayDefinition[] = [
  crmDemoOverlay,
  crmSalesRepOverlay,
];
