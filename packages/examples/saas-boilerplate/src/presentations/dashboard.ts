/**
 * SaaS Dashboard Presentation Descriptor
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';

/**
 * Main dashboard presentation for the SaaS application.
 */
export const SaasDashboardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'saas.dashboard',
    version: 1,
    description: 'Main SaaS dashboard with project overview, usage stats, and quick actions',
    domain: 'saas-boilerplate',
    owners: ['saas-team'],
    tags: ['dashboard', 'overview'],
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
};

/**
 * Settings panel presentation.
 */
export const SettingsPanelPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'saas.settings',
    version: 1,
    description: 'Organization and user settings panel',
    domain: 'saas-boilerplate',
    owners: ['saas-team'],
    tags: ['settings', 'config'],
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
};

