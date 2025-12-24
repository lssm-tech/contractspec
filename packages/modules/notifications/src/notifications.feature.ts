/**
 * Notifications Feature Module Specification
 *
 * Defines the feature module for notification management.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Notifications feature module that bundles notification sending,
 * listing, marking as read, and preference management capabilities.
 */
export const NotificationsFeature: FeatureModuleSpec = {
  meta: {
    key: 'notifications',
    title: 'Notifications',
    description:
      'Multi-channel notification delivery with preference management',
    domain: 'platform',
    version: 1,
    owners: ['@platform.notifications'],
    tags: ['notifications', 'email', 'push', 'in-app'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    { key: 'notifications.send', version: 1 },
    { key: 'notifications.markRead', version: 1 },
    { key: 'notifications.markAllRead', version: 1 },
    { key: 'notifications.delete', version: 1 },
    { key: 'notifications.list', version: 1 },
    { key: 'notifications.preferences.update', version: 1 },
    { key: 'notifications.preferences.get', version: 1 },
  ],

  // No events for this feature - it consumes events to send notifications
  events: [],

  // No presentations for this module feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'notifications', version: 1 }],
    requires: [{ key: 'identity', version: 1 }],
  },
};
