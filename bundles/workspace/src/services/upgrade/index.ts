/**
 * Upgrade service module.
 *
 * Provides upgrade analysis and application for ContractSpec SDK and config.
 */

export * from './types';
export {
  analyzeUpgrades,
  applyConfigUpgrades,
  getPackageUpgradeCommand,
  getDefaultVersioningConfig,
  getDefaultHooksConfig,
} from './upgrade-service';
