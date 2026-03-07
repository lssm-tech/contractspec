import { createHmac, timingSafeEqual } from 'node:crypto';

import type { ChannelInboundEvent } from './types';

export interface GithubIssueCommentPayload {
  action?: string;
  repository?: {
    full_name?: string;
    name?: string;
    owner?: { login?: string };
  };
  issue?: {
    number?: number;
    body?: string;
  };
  pull_request?: {
    number?: number;
    body?: string;
  };
  comment?: {
    id?: number;
    body?: string;
  };
  sender?: {
    login?: string;
  };
}

export interface GithubSignatureVerificationInput {
  webhookSecret: string;
  signatureHeader: string | null;
  rawBody: string;
}

export interface GithubSignatureVerificationResult {
  valid: boolean;
  reason?: string;
}

export function verifyGithubSignature(
  input: GithubSignatureVerificationInput
): GithubSignatureVerificationResult {
  if (!input.signatureHeader) {
    return { valid: false, reason: 'missing_signature' };
  }
  const expected = `sha256=${createHmac('sha256', input.webhookSecret)
    .update(input.rawBody)
    .digest('hex')}`;
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const providedBuffer = Buffer.from(input.signatureHeader, 'utf8');
  if (expectedBuffer.length !== providedBuffer.length) {
    return { valid: false, reason: 'signature_length_mismatch' };
  }
  return timingSafeEqual(expectedBuffer, providedBuffer)
    ? { valid: true }
    : { valid: false, reason: 'signature_mismatch' };
}

export function parseGithubWebhookPayload(
  rawBody: string
): GithubIssueCommentPayload {
  return JSON.parse(rawBody) as GithubIssueCommentPayload;
}

export interface NormalizeGithubEventInput {
  workspaceId: string;
  payload: GithubIssueCommentPayload;
  deliveryId: string;
  eventName: string;
  signatureValid: boolean;
  traceId?: string;
  rawBody?: string;
}

export function normalizeGithubInboundEvent(
  input: NormalizeGithubEventInput
): ChannelInboundEvent | null {
  const owner = input.payload.repository?.owner?.login;
  const repo = input.payload.repository?.name;
  const issueNumber =
    input.payload.issue?.number ?? input.payload.pull_request?.number;
  const messageText =
    input.payload.comment?.body ??
    input.payload.issue?.body ??
    input.payload.pull_request?.body;

  if (!owner || !repo || !issueNumber || !messageText) {
    return null;
  }

  return {
    workspaceId: input.workspaceId,
    providerKey: 'messaging.github',
    externalEventId: input.deliveryId,
    eventType: `github.${input.eventName}.${input.payload.action ?? 'unknown'}`,
    occurredAt: new Date(),
    signatureValid: input.signatureValid,
    traceId: input.traceId,
    rawPayload: input.rawBody,
    thread: {
      externalThreadId: `${owner}/${repo}#${issueNumber}`,
      externalChannelId: `${owner}/${repo}`,
      externalUserId: input.payload.sender?.login,
    },
    message: {
      text: messageText,
      externalMessageId:
        input.payload.comment?.id != null
          ? String(input.payload.comment.id)
          : undefined,
    },
    metadata: {
      owner,
      repo,
      issueNumber: String(issueNumber),
      action: input.payload.action ?? 'unknown',
      githubEvent: input.eventName,
    },
  };
}
