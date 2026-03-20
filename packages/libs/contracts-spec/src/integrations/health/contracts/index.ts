import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
	HealthListActivities,
	HealthSyncActivities,
	registerHealthActivityContracts,
} from './activities';
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
	HealthListSleep,
	HealthSyncSleep,
	registerHealthSleepContracts,
} from './sleep';
import {
	HealthWebhookIngest,
	registerHealthWebhookContracts,
} from './webhooks';
import {
	HealthListWorkouts,
	HealthSyncWorkouts,
	registerHealthWorkoutContracts,
} from './workouts';

export * from '../health.feature';
export {
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
};

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
