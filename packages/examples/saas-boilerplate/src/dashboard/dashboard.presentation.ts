import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts';

/**
 * Main dashboard presentation for the SaaS application.
 */
export const SaasDashboardPresentation = definePresentation({
  meta: {
    key: 'saas.dashboard',
    version: '1.0.0',
    title: 'SaaS Dashboard',
    description:
      'Main SaaS dashboard with project overview, usage stats, and quick actions',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['dashboard', 'overview'],
    stability: StabilityEnum.Beta,
    goal: 'Overview of SaaS activity and metrics',
    context: 'Main dashboard',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SaasDashboard',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['saas.enabled'],
  },
});

/**
 * Settings panel presentation.
 */
export const SettingsPanelPresentation = definePresentation({
  meta: {
    key: 'saas.settings',
    version: '1.0.0',
    title: 'Settings Panel',
    description: 'Organization and user settings panel',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['settings', 'config'],
    stability: StabilityEnum.Beta,
    goal: 'Configure organization and user settings',
    context: 'Settings section',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SettingsPanel',
  },
  targets: ['react'],
  policy: {
    flags: ['saas.enabled'],
  },
});
