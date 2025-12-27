import { describe, expect, it } from 'bun:test';
import {
  ConfigDraftCreatedEvent,
  ConfigPromotedToPreviewEvent,
  ConfigPublishedEvent,
  ConfigRolledBackEvent,
} from './events';

describe('App Config Lifecycle Events', () => {
  describe('ConfigDraftCreatedEvent', () => {
    it('should have correct metadata', () => {
      expect(ConfigDraftCreatedEvent.meta.key).toBe('app_config.draft_created');
      expect(ConfigDraftCreatedEvent.meta.version).toBe(1);
      expect(ConfigDraftCreatedEvent.meta.domain).toBe('app-config.lifecycle');
    });

    it('should have valid payload schema', () => {
      const zodSchema = ConfigDraftCreatedEvent.payload.getZod();
      
      const validPayload = {
        tenantId: 'tenant-123',
        appId: 'app-456',
        version: 1,
        blueprintName: 'ecommerce',
        blueprintVersion: 2,
        createdBy: 'user@example.com',
      };

      expect(() => zodSchema.parse(validPayload)).not.toThrow();
    });

    it('should support optional clonedFrom field', () => {
      const zodSchema = ConfigDraftCreatedEvent.payload.getZod();
      
      const payload = {
        tenantId: 'tenant-123',
        appId: 'app-456',
        version: 2,
        blueprintName: 'ecommerce',
        blueprintVersion: 2,
        createdBy: 'user@example.com',
        clonedFrom: 1,
      };

      expect(() => zodSchema.parse(payload)).not.toThrow();
    });
  });

  describe('ConfigPromotedToPreviewEvent', () => {
    it('should have correct metadata', () => {
      expect(ConfigPromotedToPreviewEvent.meta.key).toBe('app_config.promoted_to_preview');
      expect(ConfigPromotedToPreviewEvent.meta.version).toBe(1);
    });

    it('should have valid payload schema', () => {
      const zodSchema = ConfigPromotedToPreviewEvent.payload.getZod();
      
      const validPayload = {
        tenantId: 'tenant-123',
        appId: 'app-456',
        version: 1,
        promotedBy: 'admin@example.com',
      };

      expect(() => zodSchema.parse(validPayload)).not.toThrow();
    });

    it('should support optional warnings array', () => {
      const zodSchema = ConfigPromotedToPreviewEvent.payload.getZod();
      
      const payload = {
        tenantId: 'tenant-123',
        appId: 'app-456',
        version: 1,
        promotedBy: 'admin@example.com',
        warnings: ['Deprecated feature used', 'Missing recommended config'],
      };

      expect(() => zodSchema.parse(payload)).not.toThrow();
    });
  });

  describe('ConfigPublishedEvent', () => {
    it('should have correct metadata', () => {
      expect(ConfigPublishedEvent.meta.key).toBe('app_config.published');
      expect(ConfigPublishedEvent.meta.version).toBe(1);
    });

    it('should have valid payload schema', () => {
      const zodSchema = ConfigPublishedEvent.payload.getZod();
      
      const validPayload = {
        tenantId: 'tenant-123',
        appId: 'app-456',
        version: 3,
        publishedBy: 'admin@example.com',
      };

      expect(() => zodSchema.parse(validPayload)).not.toThrow();
    });

    it('should support optional fields', () => {
      const zodSchema = ConfigPublishedEvent.payload.getZod();
      
      const payload = {
        tenantId: 'tenant-123',
        appId: 'app-456',
        version: 3,
        previousVersion: 2,
        publishedBy: 'admin@example.com',
        changeSummary: 'Updated payment settings',
        changedSections: ['payments', 'notifications'],
      };

      expect(() => zodSchema.parse(payload)).not.toThrow();
    });
  });

  describe('ConfigRolledBackEvent', () => {
    it('should have correct metadata', () => {
      expect(ConfigRolledBackEvent.meta.key).toBe('app_config.rolled_back');
      expect(ConfigRolledBackEvent.meta.version).toBe(1);
    });

    it('should have valid payload schema', () => {
      const zodSchema = ConfigRolledBackEvent.payload.getZod();
      
      const validPayload = {
        tenantId: 'tenant-123',
        appId: 'app-456',
        newVersion: 4,
        rolledBackFrom: 3,
        rolledBackTo: 2,
        rolledBackBy: 'admin@example.com',
        reason: 'Critical bug in version 3',
      };

      expect(() => zodSchema.parse(validPayload)).not.toThrow();
    });

    it('should require all rollback fields', () => {
      const zodSchema = ConfigRolledBackEvent.payload.getZod();
      
      const incompletePayload = {
        tenantId: 'tenant-123',
        appId: 'app-456',
        newVersion: 4,
        // Missing required fields
      };

      expect(() => zodSchema.parse(incompletePayload)).toThrow();
    });
  });

  describe('Event ownership consistency', () => {
    it('should have consistent domain across all events', () => {
      const events = [
        ConfigDraftCreatedEvent,
        ConfigPromotedToPreviewEvent,
        ConfigPublishedEvent,
        ConfigRolledBackEvent,
      ];

      for (const event of events) {
        expect(event.meta.domain).toBe('app-config.lifecycle');
      }
    });

    it('should have consistent stability across all events', () => {
      const events = [
        ConfigDraftCreatedEvent,
        ConfigPromotedToPreviewEvent,
        ConfigPublishedEvent,
        ConfigRolledBackEvent,
      ];

      for (const event of events) {
        expect(event.meta.stability).toBe('beta');
      }
    });
  });
});
