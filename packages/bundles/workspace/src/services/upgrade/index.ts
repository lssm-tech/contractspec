/**
 * Upgrade service module.
 *
 * Provides upgrade analysis and application for ContractSpec SDK and config.
 */

export * from './types';
export {
	analyzeUpgrades,
	applyConfigUpgrades,
	getDefaultHooksConfig,
	getDefaultVersioningConfig,
	getPackageUpgradeCommand,
} from './upgrade-service';
