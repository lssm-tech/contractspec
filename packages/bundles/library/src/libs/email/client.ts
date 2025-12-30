import { createClient, Temv1alpha1 } from '@scaleway/sdk';
import type { Region } from '@scaleway/sdk-client';
import { Logger } from '@contractspec/lib.logger';
import type {
  EmailAddress,
  EmailConfigResult,
  EmailSendOutcome,
  EmailServiceConfig,
  SendEmailRequest,
} from './types';

const DEFAULT_FROM: EmailAddress = {
  email: 'noreply@transactional.contractspec.tech',
  name: 'ContractSpec',
};

const DEFAULT_TEAM_INBOX: EmailAddress = {
  email: 'contact@contractspec.tech',
  name: 'ContractSpec Team',
};

const DEFAULT_REGION: Region = 'fr-par';

type EmailApi = Pick<Temv1alpha1.API, 'createEmail'>;

let cachedConfig: EmailServiceConfig | null = null;
let cachedClient: EmailApi | null = null;
let apiFactory: (client: ReturnType<typeof createClient>) => EmailApi = (
  client
) => new Temv1alpha1.API(client);

const mapRegion = (value?: string | null): Region => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'par' || normalized === 'fr-par') return 'fr-par';
  if (normalized === 'ams' || normalized === 'nl-ams') return 'nl-ams';
  if (normalized === 'waw' || normalized === 'pl-waw') return 'pl-waw';
  return DEFAULT_REGION;
};

export const getEmailConfig = (): EmailConfigResult => {
  if (cachedConfig) {
    return { ok: true, config: cachedConfig };
  }

  const accessKey =
    process.env.SCALEWAY_ACCESS_KEY || process.env.SCALEWAY_ACCESS_KEY_QUEUE;
  const secretKey =
    process.env.SCALEWAY_SECRET_KEY || process.env.SCALEWAY_SECRET_KEY_QUEUE;
  const projectId = process.env.SCALEWAY_PROJECT_ID;

  if (!accessKey || !secretKey || !projectId) {
    return {
      ok: false,
      errorMessage:
        'Email service is not configured. Please contact us directly at contact@contractspec.tech.',
    };
  }

  const region = mapRegion(process.env.SCALEWAY_REGION);

  cachedConfig = {
    accessKey,
    secretKey,
    projectId,
    region,
    defaultZone: `${region}-1`,
    from: {
      email: process.env.SCALEWAY_EMAIL_FROM_EMAIL ?? DEFAULT_FROM.email,
      name: process.env.SCALEWAY_EMAIL_FROM_NAME ?? DEFAULT_FROM.name,
    },
    teamInbox: {
      email: process.env.SCALEWAY_EMAIL_TEAM_EMAIL ?? DEFAULT_TEAM_INBOX.email,
      name: process.env.SCALEWAY_EMAIL_TEAM_NAME ?? DEFAULT_TEAM_INBOX.name,
    },
  };

  return { ok: true, config: cachedConfig };
};

const getTemClient = (config: EmailServiceConfig): EmailApi => {
  if (cachedClient) {
    return cachedClient;
  }

  const client = createClient({
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    defaultProjectId: config.projectId,
    defaultRegion: config.region,
    defaultZone: config.defaultZone,
  });

  cachedClient = apiFactory(client);
  return cachedClient;
};

export const sendEmail = async (
  config: EmailServiceConfig,
  request: SendEmailRequest
): Promise<EmailSendOutcome> => {
  try {
    const client = getTemClient(config);

    await client.createEmail({
      region: config.region,
      projectId: config.projectId,
      from: config.from,
      to: request.to,
      subject: request.subject,
      text: request.text,
      html: request.html || request.text,
      additionalHeaders: request.replyTo
        ? [{ key: 'Reply-To', value: request.replyTo }]
        : undefined,
    });

    return { success: true };
  } catch (error) {
    new Logger().error('scaleway_tem_email_send_failed', {
      context: request.context ?? 'email',
      error: error instanceof Error ? error.message : error,
    });
    return {
      success: false,
      error,
      errorMessage: 'Failed to send email via Scaleway.',
    };
  }
};

export const __internal = {
  resetCaches() {
    cachedClient = null;
    cachedConfig = null;
    apiFactory = (client: ReturnType<typeof createClient>) =>
      new Temv1alpha1.API(client);
  },
  setApiFactory(
    factory: (client: ReturnType<typeof createClient>) => EmailApi
  ) {
    apiFactory = factory;
  },
  setClient(client: EmailApi) {
    cachedClient = client;
  },
};
