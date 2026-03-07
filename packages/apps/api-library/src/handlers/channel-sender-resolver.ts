import type {
  ChannelMessageSender,
  ChannelOutboxActionRecord,
} from '@contractspec/integration.runtime/channel';
import {
  GithubMessagingProvider,
  MetaWhatsappMessagingProvider,
  SlackMessagingProvider,
  TwilioWhatsappMessagingProvider,
} from '@contractspec/integration.providers-impls/impls';

let slackProvider: SlackMessagingProvider | null | undefined;
let githubProvider: GithubMessagingProvider | null | undefined;
let metaWhatsappProvider: MetaWhatsappMessagingProvider | null | undefined;
let twilioWhatsappProvider: TwilioWhatsappMessagingProvider | null | undefined;

export async function resolveMessagingSender(
  providerKey: string
): Promise<ChannelMessageSender | null> {
  switch (providerKey) {
    case 'messaging.slack': {
      const provider = getSlackProvider();
      return provider ? toSlackSender(provider) : null;
    }
    case 'messaging.github': {
      const provider = getGithubProvider();
      return provider ? toGithubSender(provider) : null;
    }
    case 'messaging.whatsapp.meta': {
      const provider = getMetaWhatsappProvider();
      return provider ? toWhatsappSender(provider) : null;
    }
    case 'messaging.whatsapp.twilio': {
      const provider = getTwilioWhatsappProvider();
      return provider ? toWhatsappSender(provider) : null;
    }
    default:
      return null;
  }
}

export function resetSenderResolverForTests(): void {
  slackProvider = undefined;
  githubProvider = undefined;
  metaWhatsappProvider = undefined;
  twilioWhatsappProvider = undefined;
}

function toSlackSender(provider: {
  sendMessage(input: {
    recipientId?: string;
    channelId?: string;
    threadId?: string;
    text: string;
    markdown?: boolean;
    metadata?: Record<string, string>;
  }): Promise<{ providerMessageId?: string }>;
}): ChannelMessageSender {
  return {
    async send(action: ChannelOutboxActionRecord) {
      const text = toActionText(action);
      const target = action.target;
      const response = await provider.sendMessage({
        recipientId: toOptionalString(target.externalUserId),
        channelId: toOptionalString(target.externalChannelId),
        threadId: toOptionalString(target.externalThreadId),
        text,
        metadata: {
          outboxActionId: action.id,
          decisionId: action.decisionId,
        },
      });
      return {
        providerMessageId: response.providerMessageId,
      };
    },
  };
}

function toGithubSender(provider: {
  sendMessage(input: {
    recipientId?: string;
    channelId?: string;
    threadId?: string;
    text: string;
    markdown?: boolean;
    metadata?: Record<string, string>;
  }): Promise<{ providerMessageId?: string }>;
}): ChannelMessageSender {
  return {
    async send(action: ChannelOutboxActionRecord) {
      const text = toActionText(action);
      const target = action.target;
      const response = await provider.sendMessage({
        recipientId: toOptionalString(target.externalThreadId),
        text,
        metadata: {
          outboxActionId: action.id,
          decisionId: action.decisionId,
          owner:
            toOptionalString(target.externalChannelId)?.split('/')[0] ?? '',
          repo: toOptionalString(target.externalChannelId)?.split('/')[1] ?? '',
        },
      });
      return {
        providerMessageId: response.providerMessageId,
      };
    },
  };
}

function toWhatsappSender(provider: {
  sendMessage(input: {
    recipientId?: string;
    channelId?: string;
    threadId?: string;
    text: string;
    markdown?: boolean;
    metadata?: Record<string, string>;
  }): Promise<{ providerMessageId?: string }>;
}): ChannelMessageSender {
  return {
    async send(action: ChannelOutboxActionRecord) {
      const text = toActionText(action);
      const target = action.target;
      const response = await provider.sendMessage({
        recipientId:
          toOptionalString(target.externalUserId) ??
          toOptionalString(target.externalThreadId),
        channelId: toOptionalString(target.externalChannelId),
        threadId: toOptionalString(target.externalThreadId),
        text,
        metadata: {
          outboxActionId: action.id,
          decisionId: action.decisionId,
        },
      });
      return {
        providerMessageId: response.providerMessageId,
      };
    },
  };
}

function getSlackProvider(): SlackMessagingProvider | null {
  if (slackProvider !== undefined) return slackProvider;
  const botToken = process.env.SLACK_BOT_TOKEN;
  if (!botToken) {
    slackProvider = null;
    return slackProvider;
  }
  slackProvider = new SlackMessagingProvider({
    botToken,
    defaultChannelId: process.env.SLACK_DEFAULT_CHANNEL_ID,
    apiBaseUrl: process.env.SLACK_API_BASE_URL,
  });
  return slackProvider;
}

function getGithubProvider(): GithubMessagingProvider | null {
  if (githubProvider !== undefined) return githubProvider;
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    githubProvider = null;
    return githubProvider;
  }
  githubProvider = new GithubMessagingProvider({
    token,
    defaultOwner: process.env.GITHUB_DEFAULT_OWNER,
    defaultRepo: process.env.GITHUB_DEFAULT_REPO,
    apiBaseUrl: process.env.GITHUB_API_BASE_URL,
  });
  return githubProvider;
}

function getMetaWhatsappProvider(): MetaWhatsappMessagingProvider | null {
  if (metaWhatsappProvider !== undefined) return metaWhatsappProvider;
  const accessToken = process.env.WHATSAPP_META_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_META_PHONE_NUMBER_ID;
  if (!accessToken || !phoneNumberId) {
    metaWhatsappProvider = null;
    return metaWhatsappProvider;
  }
  metaWhatsappProvider = new MetaWhatsappMessagingProvider({
    accessToken,
    phoneNumberId,
    apiVersion: process.env.WHATSAPP_META_API_VERSION,
  });
  return metaWhatsappProvider;
}

function getTwilioWhatsappProvider(): TwilioWhatsappMessagingProvider | null {
  if (twilioWhatsappProvider !== undefined) return twilioWhatsappProvider;
  const accountSid = process.env.WHATSAPP_TWILIO_ACCOUNT_SID;
  const authToken = process.env.WHATSAPP_TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    twilioWhatsappProvider = null;
    return twilioWhatsappProvider;
  }
  twilioWhatsappProvider = new TwilioWhatsappMessagingProvider({
    accountSid,
    authToken,
    fromNumber: process.env.WHATSAPP_TWILIO_FROM_NUMBER,
  });
  return twilioWhatsappProvider;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function toActionText(action: ChannelOutboxActionRecord): string {
  return typeof action.payload.text === 'string'
    ? action.payload.text
    : JSON.stringify(action.payload);
}
