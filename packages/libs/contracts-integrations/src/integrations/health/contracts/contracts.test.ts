import { describe, expect, it } from 'bun:test';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
  HealthListActivities,
  HealthListBiometrics,
  HealthListNutrition,
  HealthListSleep,
  HealthListWorkouts,
  HealthSyncActivities,
  HealthSyncBiometrics,
  HealthSyncNutrition,
  HealthSyncSleep,
  HealthSyncWorkouts,
  HealthWebhookIngest,
  registerHealthContracts,
} from './index';

describe('health integration contracts', () => {
  it('registers all health operations', () => {
    const registry = registerHealthContracts(new OperationSpecRegistry());

    expect(registry.get('health.activities.list', '1.0.0')).toBe(
      HealthListActivities
    );
    expect(registry.get('health.activities.sync', '1.0.0')).toBe(
      HealthSyncActivities
    );
    expect(registry.get('health.workouts.list', '1.0.0')).toBe(
      HealthListWorkouts
    );
    expect(registry.get('health.workouts.sync', '1.0.0')).toBe(
      HealthSyncWorkouts
    );
    expect(registry.get('health.sleep.list', '1.0.0')).toBe(HealthListSleep);
    expect(registry.get('health.sleep.sync', '1.0.0')).toBe(HealthSyncSleep);
    expect(registry.get('health.biometrics.list', '1.0.0')).toBe(
      HealthListBiometrics
    );
    expect(registry.get('health.biometrics.sync', '1.0.0')).toBe(
      HealthSyncBiometrics
    );
    expect(registry.get('health.nutrition.list', '1.0.0')).toBe(
      HealthListNutrition
    );
    expect(registry.get('health.nutrition.sync', '1.0.0')).toBe(
      HealthSyncNutrition
    );
    expect(registry.get('health.webhooks.ingest', '1.0.0')).toBe(
      HealthWebhookIngest
    );
  });
});
