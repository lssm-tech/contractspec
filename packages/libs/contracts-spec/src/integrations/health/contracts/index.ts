import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
  HealthListActivities,
  HealthSyncActivities,
  registerHealthActivityContracts,
} from './activities';
import {
  HealthListWorkouts,
  HealthSyncWorkouts,
  registerHealthWorkoutContracts,
} from './workouts';
import {
  HealthListSleep,
  HealthSyncSleep,
  registerHealthSleepContracts,
} from './sleep';
import {
  HealthListBiometrics,
  HealthSyncBiometrics,
  registerHealthBiometricContracts,
} from './biometrics';
import {
  HealthListNutrition,
  HealthSyncNutrition,
  registerHealthNutritionContracts,
} from './nutrition';
import {
  HealthWebhookIngest,
  registerHealthWebhookContracts,
} from './webhooks';

export {
  HealthListActivities,
  HealthSyncActivities,
  HealthListWorkouts,
  HealthSyncWorkouts,
  HealthListSleep,
  HealthSyncSleep,
  HealthListBiometrics,
  HealthSyncBiometrics,
  HealthListNutrition,
  HealthSyncNutrition,
  HealthWebhookIngest,
};

export * from '../health.feature';

export function registerHealthContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registerHealthWebhookContracts(
    registerHealthNutritionContracts(
      registerHealthBiometricContracts(
        registerHealthSleepContracts(
          registerHealthWorkoutContracts(
            registerHealthActivityContracts(registry)
          )
        )
      )
    )
  );
}
