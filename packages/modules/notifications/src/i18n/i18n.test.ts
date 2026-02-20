import { describe, it, expect, beforeEach } from 'bun:test';
import {
  createNotificationsI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
import { resolveLocale, isSupportedLocale, SUPPORTED_LOCALES } from './locale';
import { I18N_KEYS } from './keys';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import {
  WelcomeTemplate,
  OrgInviteTemplate,
  MentionTemplate,
  renderNotificationTemplate,
} from '../templates';

// =============================================================================
// Locale Resolution
// =============================================================================

describe('resolveLocale', () => {
  it('should default to "en"', () => {
    expect(resolveLocale()).toBe('en');
  });

  it('should use optionsLocale when provided', () => {
    expect(resolveLocale('fr')).toBe('fr');
  });

  it('should prefer runtimeLocale over optionsLocale', () => {
    expect(resolveLocale('fr', 'es')).toBe('es');
  });

  it('should fall back to base language for regional variants', () => {
    expect(resolveLocale('fr-CA')).toBe('fr');
  });

  it('should fall back to DEFAULT_LOCALE for unsupported locales', () => {
    expect(resolveLocale('de')).toBe('en');
  });
});

describe('isSupportedLocale', () => {
  it('should return true for supported locales', () => {
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(true);
    expect(isSupportedLocale('es')).toBe(true);
  });

  it('should return false for unsupported locales', () => {
    expect(isSupportedLocale('de')).toBe(false);
  });
});

describe('SUPPORTED_LOCALES', () => {
  it('should contain en, fr, es', () => {
    expect(SUPPORTED_LOCALES).toContain('en');
    expect(SUPPORTED_LOCALES).toContain('fr');
    expect(SUPPORTED_LOCALES).toContain('es');
    expect(SUPPORTED_LOCALES).toHaveLength(3);
  });
});

// =============================================================================
// Translation
// =============================================================================

describe('createNotificationsI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should create an i18n instance with default locale', () => {
    const i18n = createNotificationsI18n();
    expect(i18n.locale).toBe('en');
  });

  it('should create an i18n instance with options locale', () => {
    const i18n = createNotificationsI18n('fr');
    expect(i18n.locale).toBe('fr');
  });
});

describe('t() - English', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return English template names', () => {
    const i18n = createNotificationsI18n('en');
    expect(i18n.t('template.welcome.name')).toBe('Welcome');
    expect(i18n.t('template.orgInvite.name')).toBe('Organization Invitation');
    expect(i18n.t('template.mention.name')).toBe('Mention');
  });

  it('should return English channel errors', () => {
    const i18n = createNotificationsI18n('en');
    expect(i18n.t('channel.webhook.noUrl')).toBe('No webhook URL configured');
  });

  it('should return the key itself for unknown keys', () => {
    const i18n = createNotificationsI18n('en');
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('t() - French', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return French template names', () => {
    const i18n = createNotificationsI18n('fr');
    expect(i18n.t('template.welcome.name')).toBe('Bienvenue');
    expect(i18n.t('template.mention.name')).toBe('Mention');
  });

  it('should return French channel errors', () => {
    const i18n = createNotificationsI18n('fr');
    expect(i18n.t('channel.webhook.noUrl')).toContain('webhook');
  });
});

describe('t() - Spanish', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return Spanish template names', () => {
    const i18n = createNotificationsI18n('es');
    expect(i18n.t('template.welcome.name')).toBe('Bienvenida');
    expect(i18n.t('template.mention.name')).toBe('Menci\u00f3n');
  });
});

describe('getDefaultI18n', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should return an English i18n instance', () => {
    const i18n = getDefaultI18n();
    expect(i18n.locale).toBe('en');
  });
});

// =============================================================================
// Catalog Completeness
// =============================================================================

describe('catalog completeness', () => {
  const allKeys = Object.keys(I18N_KEYS);

  it('should have all keys in English catalog', () => {
    const enKeys = Object.keys(enMessages.messages);
    for (const key of allKeys) {
      expect(enKeys).toContain(key);
    }
  });

  it('should have all keys in French catalog', () => {
    const frKeys = Object.keys(frMessages.messages);
    for (const key of allKeys) {
      expect(frKeys).toContain(key);
    }
  });

  it('should have all keys in Spanish catalog', () => {
    const esKeys = Object.keys(esMessages.messages);
    for (const key of allKeys) {
      expect(esKeys).toContain(key);
    }
  });

  it('should have matching key counts across all catalogs', () => {
    const enCount = Object.keys(enMessages.messages).length;
    const frCount = Object.keys(frMessages.messages).length;
    const esCount = Object.keys(esMessages.messages).length;

    expect(enCount).toBe(frCount);
    expect(enCount).toBe(esCount);
    expect(enCount).toBe(allKeys.length);
  });

  it('should have exactly 7 keys', () => {
    expect(allKeys).toHaveLength(7);
  });
});

// =============================================================================
// Template Locale Rendering
// =============================================================================

describe('renderNotificationTemplate with locale', () => {
  const vars = {
    name: 'Alice',
    appName: 'ContractSpec',
    actionUrl: 'https://example.com',
  };

  it('should render English template by default', () => {
    const result = renderNotificationTemplate(WelcomeTemplate, 'inApp', vars);
    expect(result?.title).toBe('Welcome to ContractSpec!');
  });

  it('should render French template when locale is fr', () => {
    const result = renderNotificationTemplate(
      WelcomeTemplate,
      'inApp',
      vars,
      'fr'
    );
    expect(result?.title).toContain('Bienvenue');
    expect(result?.title).toContain('ContractSpec');
  });

  it('should render Spanish template when locale is es', () => {
    const result = renderNotificationTemplate(
      WelcomeTemplate,
      'inApp',
      vars,
      'es'
    );
    expect(result?.title).toContain('Bienvenido');
  });

  it('should fall back to default channels for unsupported locale', () => {
    const result = renderNotificationTemplate(
      WelcomeTemplate,
      'inApp',
      vars,
      'de'
    );
    expect(result?.title).toBe('Welcome to ContractSpec!');
  });

  it('should render localized org invite', () => {
    const inviteVars = {
      inviterName: 'Bob',
      orgName: 'Acme',
      role: 'admin',
      actionUrl: 'https://example.com/invite',
    };
    const result = renderNotificationTemplate(
      OrgInviteTemplate,
      'inApp',
      inviteVars,
      'fr'
    );
    expect(result?.body).toContain('invit\u00e9');
  });

  it('should render localized mention', () => {
    const mentionVars = {
      mentionerName: 'Carol',
      context: 'docs',
      preview: 'Great idea!',
      actionUrl: 'https://example.com/mention',
    };
    const result = renderNotificationTemplate(
      MentionTemplate,
      'inApp',
      mentionVars,
      'es'
    );
    expect(result?.title).toContain('mencion\u00f3');
  });
});
