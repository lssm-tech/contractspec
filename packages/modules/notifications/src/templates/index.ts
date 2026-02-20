/**
 * Template variable definition.
 */
export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'url';
  required?: boolean;
  default?: string | number | boolean;
  description?: string;
}

/**
 * Channel-specific template content.
 */
export interface ChannelTemplateContent {
  title?: string;
  subject?: string;
  body: string;
  actionUrl?: string;
  actionText?: string;
}

/** Channel content map for a template. */
export type ChannelContentMap = {
  email?: ChannelTemplateContent;
  inApp?: ChannelTemplateContent;
  push?: ChannelTemplateContent;
  webhook?: ChannelTemplateContent;
};

/**
 * Notification template definition.
 */
export interface NotificationTemplateDefinition {
  id: string;
  name: string;
  description?: string;
  category?: string;
  variables?: TemplateVariable[];
  defaultChannels?: string[];
  channels: ChannelContentMap;
  /**
   * Per-locale channel content overrides.
   * Falls back to `channels` for unlisted locales.
   */
  localeChannels?: Record<string, Partial<ChannelContentMap>>;
}

/**
 * Rendered notification content.
 */
export interface RenderedNotification {
  title: string;
  body: string;
  actionUrl?: string;
  email?: {
    subject: string;
    html: string;
    text: string;
  };
}

/**
 * Define a notification template.
 */
export function defineTemplate(
  def: NotificationTemplateDefinition
): NotificationTemplateDefinition {
  return def;
}

/**
 * Render a template with variables.
 */
export function renderTemplate(
  content: string,
  variables: Record<string, unknown>
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    if (value === undefined || value === null) {
      return match; // Keep placeholder if no value
    }
    return String(value);
  });
}

/**
 * Render a notification template for a specific channel.
 *
 * When `locale` is provided, the renderer first looks for channel content
 * under `localeChannels[locale]`, falling back to the default `channels`.
 */
export function renderNotificationTemplate(
  template: NotificationTemplateDefinition,
  channel: keyof ChannelContentMap,
  variables: Record<string, unknown>,
  locale?: string
): RenderedNotification | null {
  const channelContent =
    (locale && template.localeChannels?.[locale]?.[channel]) ??
    template.channels[channel];

  if (!channelContent) {
    return null;
  }

  const title = channelContent.title
    ? renderTemplate(channelContent.title, variables)
    : template.name;

  const body = renderTemplate(channelContent.body, variables);

  const actionUrl = channelContent.actionUrl
    ? renderTemplate(channelContent.actionUrl, variables)
    : undefined;

  const result: RenderedNotification = {
    title,
    body,
    actionUrl,
  };

  // Add email-specific rendering
  if (channel === 'email' && channelContent.subject) {
    result.email = {
      subject: renderTemplate(channelContent.subject, variables),
      html: body,
      text: stripHtml(body),
    };
  }

  return result;
}

/**
 * Strip HTML tags from content (for plain text).
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Template registry for managing templates.
 */
export class TemplateRegistry {
  private templates = new Map<string, NotificationTemplateDefinition>();

  register(template: NotificationTemplateDefinition): void {
    this.templates.set(template.id, template);
  }

  get(templateId: string): NotificationTemplateDefinition | undefined {
    return this.templates.get(templateId);
  }

  getAll(): NotificationTemplateDefinition[] {
    return Array.from(this.templates.values());
  }

  getByCategory(category: string): NotificationTemplateDefinition[] {
    return this.getAll().filter((t) => t.category === category);
  }
}

/**
 * Create a template registry.
 */
export function createTemplateRegistry(): TemplateRegistry {
  return new TemplateRegistry();
}

// ============ Standard Templates ============

/**
 * Welcome email template.
 */
export const WelcomeTemplate = defineTemplate({
  id: 'welcome',
  name: 'Welcome',
  description: 'Sent when a user signs up.',
  category: 'onboarding',
  variables: [
    { name: 'name', type: 'string', required: true },
    { name: 'appName', type: 'string', default: 'ContractSpec' },
    { name: 'actionUrl', type: 'url' },
  ],
  defaultChannels: ['EMAIL', 'IN_APP'],
  channels: {
    email: {
      subject: 'Welcome to {{appName}}, {{name}}!',
      body: `
        <h1>Welcome, {{name}}!</h1>
        <p>Thanks for joining {{appName}}. We're excited to have you on board.</p>
        <p><a href="{{actionUrl}}">Get started now</a></p>
      `,
    },
    inApp: {
      title: 'Welcome to {{appName}}!',
      body: 'Thanks for joining. Click to complete your profile.',
      actionUrl: '{{actionUrl}}',
    },
  },
  localeChannels: {
    fr: {
      email: {
        subject: 'Bienvenue sur {{appName}}, {{name}}\u202f!',
        body: `
          <h1>Bienvenue, {{name}}\u202f!</h1>
          <p>Merci d\u2019avoir rejoint {{appName}}. Nous sommes ravis de vous compter parmi nous.</p>
          <p><a href="{{actionUrl}}">Commencer maintenant</a></p>
        `,
      },
      inApp: {
        title: 'Bienvenue sur {{appName}}\u202f!',
        body: 'Merci de nous avoir rejoint. Cliquez pour compl\u00e9ter votre profil.',
        actionUrl: '{{actionUrl}}',
      },
    },
    es: {
      email: {
        subject: '\u00a1Bienvenido a {{appName}}, {{name}}!',
        body: `
          <h1>\u00a1Bienvenido, {{name}}!</h1>
          <p>Gracias por unirte a {{appName}}. Estamos encantados de tenerte.</p>
          <p><a href="{{actionUrl}}">Comenzar ahora</a></p>
        `,
      },
      inApp: {
        title: '\u00a1Bienvenido a {{appName}}!',
        body: 'Gracias por unirte. Haz clic para completar tu perfil.',
        actionUrl: '{{actionUrl}}',
      },
    },
  },
});

/**
 * Organization invite template.
 */
export const OrgInviteTemplate = defineTemplate({
  id: 'org-invite',
  name: 'Organization Invitation',
  description: 'Sent when a user is invited to an organization.',
  category: 'organization',
  variables: [
    { name: 'inviterName', type: 'string', required: true },
    { name: 'orgName', type: 'string', required: true },
    { name: 'role', type: 'string', default: 'member' },
    { name: 'actionUrl', type: 'url', required: true },
  ],
  defaultChannels: ['EMAIL'],
  channels: {
    email: {
      subject: '{{inviterName}} invited you to join {{orgName}}',
      body: `
        <h1>You've been invited!</h1>
        <p>{{inviterName}} has invited you to join <strong>{{orgName}}</strong> as a {{role}}.</p>
        <p><a href="{{actionUrl}}">Accept invitation</a></p>
      `,
    },
    inApp: {
      title: 'Invitation to {{orgName}}',
      body: '{{inviterName}} invited you to join as {{role}}.',
      actionUrl: '{{actionUrl}}',
      actionText: 'Accept',
    },
  },
  localeChannels: {
    fr: {
      email: {
        subject: '{{inviterName}} vous invite \u00e0 rejoindre {{orgName}}',
        body: `
          <h1>Vous \u00eates invit\u00e9\u202f!</h1>
          <p>{{inviterName}} vous a invit\u00e9 \u00e0 rejoindre <strong>{{orgName}}</strong> en tant que {{role}}.</p>
          <p><a href="{{actionUrl}}">Accepter l\u2019invitation</a></p>
        `,
      },
      inApp: {
        title: 'Invitation \u00e0 {{orgName}}',
        body: '{{inviterName}} vous a invit\u00e9 \u00e0 rejoindre en tant que {{role}}.',
        actionUrl: '{{actionUrl}}',
        actionText: 'Accepter',
      },
    },
    es: {
      email: {
        subject: '{{inviterName}} te invit\u00f3 a unirte a {{orgName}}',
        body: `
          <h1>\u00a1Has sido invitado!</h1>
          <p>{{inviterName}} te ha invitado a unirte a <strong>{{orgName}}</strong> como {{role}}.</p>
          <p><a href="{{actionUrl}}">Aceptar invitaci\u00f3n</a></p>
        `,
      },
      inApp: {
        title: 'Invitaci\u00f3n a {{orgName}}',
        body: '{{inviterName}} te invit\u00f3 a unirte como {{role}}.',
        actionUrl: '{{actionUrl}}',
        actionText: 'Aceptar',
      },
    },
  },
});

/**
 * Mention template.
 */
export const MentionTemplate = defineTemplate({
  id: 'mention',
  name: 'Mention',
  description: 'Sent when a user is mentioned.',
  category: 'social',
  variables: [
    { name: 'mentionerName', type: 'string', required: true },
    { name: 'context', type: 'string', required: true },
    { name: 'preview', type: 'string' },
    { name: 'actionUrl', type: 'url', required: true },
  ],
  defaultChannels: ['IN_APP', 'PUSH'],
  channels: {
    inApp: {
      title: '{{mentionerName}} mentioned you',
      body: 'In {{context}}: "{{preview}}"',
      actionUrl: '{{actionUrl}}',
    },
    push: {
      title: '{{mentionerName}} mentioned you',
      body: '{{preview}}',
    },
  },
  localeChannels: {
    fr: {
      inApp: {
        title: '{{mentionerName}} vous a mentionn\u00e9',
        body: 'Dans {{context}}\u202f: \u00ab\u202f{{preview}}\u202f\u00bb',
        actionUrl: '{{actionUrl}}',
      },
      push: {
        title: '{{mentionerName}} vous a mentionn\u00e9',
        body: '{{preview}}',
      },
    },
    es: {
      inApp: {
        title: '{{mentionerName}} te mencion\u00f3',
        body: 'En {{context}}: "{{preview}}"',
        actionUrl: '{{actionUrl}}',
      },
      push: {
        title: '{{mentionerName}} te mencion\u00f3',
        body: '{{preview}}',
      },
    },
  },
});
