'use server';

import { beforeEach, describe, expect, it } from 'bun:test';
import { getEmailConfig, sendEmail, __internal } from './client';

const ENV_KEYS = [
  'SCALEWAY_ACCESS_KEY',
  'SCALEWAY_SECRET_KEY',
  'SCALEWAY_PROJECT_ID',
  'SCALEWAY_ACCESS_KEY_QUEUE',
  'SCALEWAY_SECRET_KEY_QUEUE',
  'SCALEWAY_REGION',
  'SCALEWAY_EMAIL_FROM_EMAIL',
  'SCALEWAY_EMAIL_FROM_NAME',
  'SCALEWAY_EMAIL_TEAM_EMAIL',
  'SCALEWAY_EMAIL_TEAM_NAME',
];

const clearEnv = () => {
  ENV_KEYS.forEach((key) => {
    delete process.env[key];
  });
};

const setEnv = (values: Partial<Record<string, string>>) => {
  Object.entries(values).forEach(([key, value]) => {
    process.env[key] = value;
  });
};

describe('email client config', () => {
  beforeEach(() => {
    __internal.resetCaches();
    clearEnv();
  });

  it('returns a failure result when credentials are missing', () => {
    const result = getEmailConfig();
    expect(result.ok).toBeFalse();
    expect(result.config).toBeUndefined();
  });

  it('prefers Scaleway env variables for config and region mapping', () => {
    setEnv({
      SCALEWAY_ACCESS_KEY: 'access',
      SCALEWAY_SECRET_KEY: 'secret',
      SCALEWAY_PROJECT_ID: 'project-123',
      SCALEWAY_EMAIL_FROM_EMAIL: 'from@example.com',
      SCALEWAY_EMAIL_FROM_NAME: 'From Name',
      SCALEWAY_EMAIL_TEAM_EMAIL: 'team@example.com',
      SCALEWAY_EMAIL_TEAM_NAME: 'Team Name',
    });

    const result = getEmailConfig();
    expect(result.ok).toBeTrue();
    expect(result.config?.accessKey).toBe('access');
    expect(result.config?.secretKey).toBe('secret');
    expect(result.config?.projectId).toBe('project-123');
    expect(result.config?.region).toBe('nl-ams');
    expect(result.config?.from.email).toBe('from@example.com');
    expect(result.config?.from.name).toBe('From Name');
    expect(result.config?.teamInbox.email).toBe('team@example.com');
    expect(result.config?.teamInbox.name).toBe('Team Name');
  });

  it('uses provided API factory to send email with reply-to header', async () => {
    setEnv({
      SCALEWAY_ACCESS_KEY: 'access',
      SCALEWAY_SECRET_KEY: 'secret',
      SCALEWAY_PROJECT_ID: 'project-123',
    });

    let captured: unknown = null;

    __internal.setClient({
      async createEmail(request) {
        captured = request;
        return {};
      },
    });

    const config = getEmailConfig().config!;

    const response = await sendEmail(config, {
      to: [{ email: 'user@example.com' }],
      subject: 'Subject',
      text: 'Plain text',
      html: '<p>html</p>',
      replyTo: 'reply@example.com',
      context: 'test',
    });

    expect(response.success).toBeTrue();
    const createEmailRequest = captured as Record<string, unknown>;
    expect(createEmailRequest.region).toBe(config.region);
    expect(createEmailRequest.projectId).toBe(config.projectId);
    expect(createEmailRequest.from).toStrictEqual(config.from);
    expect(createEmailRequest.to).toStrictEqual([
      { email: 'user@example.com' },
    ]);
    expect(createEmailRequest.additionalHeaders).toStrictEqual([
      { key: 'Reply-To', value: 'reply@example.com' },
    ]);
  });
});
