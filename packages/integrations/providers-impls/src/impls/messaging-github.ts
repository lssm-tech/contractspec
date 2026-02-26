import type {
  MessagingProvider,
  MessagingSendInput,
  MessagingSendResult,
  MessagingUpdateInput,
} from '../messaging';

interface GithubCommentResponse {
  id?: number;
  node_id?: string;
  html_url?: string;
  message?: string;
}

export interface GithubMessagingProviderOptions {
  token: string;
  defaultOwner?: string;
  defaultRepo?: string;
  apiBaseUrl?: string;
}

interface GithubTarget {
  owner: string;
  repo: string;
  issueNumber: number;
}

export class GithubMessagingProvider implements MessagingProvider {
  private readonly token: string;
  private readonly defaultOwner?: string;
  private readonly defaultRepo?: string;
  private readonly apiBaseUrl: string;

  constructor(options: GithubMessagingProviderOptions) {
    this.token = options.token;
    this.defaultOwner = options.defaultOwner;
    this.defaultRepo = options.defaultRepo;
    this.apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com';
  }

  async sendMessage(input: MessagingSendInput): Promise<MessagingSendResult> {
    const target = this.resolveTarget(input);
    const response = await fetch(
      `${this.apiBaseUrl}/repos/${target.owner}/${target.repo}/issues/${target.issueNumber}/comments`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.token}`,
          accept: 'application/vnd.github+json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ body: input.text }),
      }
    );

    const body = (await response.json()) as GithubCommentResponse;
    if (!response.ok || !body.id) {
      throw new Error(
        `GitHub sendMessage failed: ${body.message ?? `HTTP_${response.status}`}`
      );
    }

    return {
      id: String(body.id),
      providerMessageId: body.node_id,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        url: body.html_url ?? '',
        owner: target.owner,
        repo: target.repo,
        issueNumber: String(target.issueNumber),
      },
    };
  }

  async updateMessage(
    messageId: string,
    input: MessagingUpdateInput
  ): Promise<MessagingSendResult> {
    const owner = input.metadata?.owner ?? this.defaultOwner;
    const repo = input.metadata?.repo ?? this.defaultRepo;
    if (!owner || !repo) {
      throw new Error('GitHub updateMessage requires owner and repo metadata.');
    }

    const response = await fetch(
      `${this.apiBaseUrl}/repos/${owner}/${repo}/issues/comments/${messageId}`,
      {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${this.token}`,
          accept: 'application/vnd.github+json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ body: input.text }),
      }
    );

    const body = (await response.json()) as GithubCommentResponse;
    if (!response.ok || !body.id) {
      throw new Error(
        `GitHub updateMessage failed: ${body.message ?? `HTTP_${response.status}`}`
      );
    }

    return {
      id: String(body.id),
      providerMessageId: body.node_id,
      status: 'sent',
      sentAt: new Date(),
      metadata: {
        url: body.html_url ?? '',
        owner,
        repo,
      },
    };
  }

  private resolveTarget(input: MessagingSendInput): GithubTarget {
    const parsedRecipient = parseRecipient(input.recipientId);
    const owner = parsedRecipient?.owner ?? this.defaultOwner;
    const repo = parsedRecipient?.repo ?? this.defaultRepo;
    const issueNumber =
      parsedRecipient?.issueNumber ?? parseIssueNumber(input.threadId);

    if (!owner || !repo || issueNumber == null) {
      throw new Error(
        'GitHub sendMessage requires owner/repo and issueNumber (use recipientId like owner/repo#123 or provide defaults + threadId).'
      );
    }

    return {
      owner,
      repo,
      issueNumber,
    };
  }
}

function parseRecipient(value?: string): GithubTarget | null {
  if (!value) return null;
  const match = value.trim().match(/^([^/]+)\/([^#]+)#(\d+)$/);
  if (!match) return null;
  const owner = match[1];
  const repo = match[2];
  const issueNumber = Number(match[3]);
  if (!owner || !repo || !Number.isInteger(issueNumber)) {
    return null;
  }
  return { owner, repo, issueNumber };
}

function parseIssueNumber(value?: string): number | null {
  if (!value) return null;
  const numeric = Number(value);
  return Number.isInteger(numeric) ? numeric : null;
}
