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
  channels: {
    email?: ChannelTemplateContent;
    inApp?: ChannelTemplateContent;
    push?: ChannelTemplateContent;
    webhook?: ChannelTemplateContent;
  };
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
 */
export function renderNotificationTemplate(
  template: NotificationTemplateDefinition,
  channel: keyof NotificationTemplateDefinition['channels'],
  variables: Record<string, unknown>
): RenderedNotification | null {
  const channelContent = template.channels[channel];
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
});
