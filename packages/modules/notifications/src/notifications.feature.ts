/**
 * Notifications Feature Module Specification
 *
 * Defines the feature module for notification management.
 */
import { defineFeature } from '@contractspec/lib.contracts-spec';

/**
 * Notifications feature module that bundles notification sending,
 * listing, marking as read, and preference management capabilities.
 */
export const NotificationsFeature = defineFeature({
  meta: {
    key: 'notifications',
    title: 'Notifications',
    description:
      'Multi-channel notification delivery with preference management',
    domain: 'platform',
    version: '1.0.0',
    owners: ['@platform.notifications'],
    tags: ['notifications', 'email', 'push', 'in-app'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    { key: 'notifications.send', version: '1.0.0' },
    { key: 'notifications.markRead', version: '1.0.0' },
    { key: 'notifications.markAllRead', version: '1.0.0' },
    { key: 'notifications.delete', version: '1.0.0' },
    { key: 'notifications.list', version: '1.0.0' },
    { key: 'notifications.preferences.update', version: '1.0.0' },
    { key: 'notifications.preferences.get', version: '1.0.0' },
  ],

  // No events for this feature - it consumes events to send notifications
  events: [],

  // No presentations for this module feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'notifications', version: '1.0.0' }],
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});
