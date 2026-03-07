import {
  MistralSttProvider,
  type MistralSttProviderOptions,
} from './mistral-stt';
import {
  MistralConversationSession,
  type ConversationMessage,
} from './mistral-conversational.session';
import type {
  ConversationalProvider,
  ConversationalSession,
  ConversationalSessionConfig,
  STTProvider,
  Voice,
} from '../voice';

export interface MistralConversationalProviderOptions {
  apiKey: string;
  defaultModel?: string;
  defaultVoiceId?: string;
  serverURL?: string;
  fetchImpl?: typeof fetch;
  sttProvider?: STTProvider;
  sttOptions?: Omit<MistralSttProviderOptions, 'apiKey' | 'fetchImpl'>;
}

const DEFAULT_BASE_URL = 'https://api.mistral.ai/v1';
const DEFAULT_MODEL = 'mistral-small-latest';
const DEFAULT_VOICE = 'default';

export class MistralConversationalProvider implements ConversationalProvider {
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly defaultVoiceId: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly sttProvider: STTProvider;

  constructor(options: MistralConversationalProviderOptions) {
    if (!options.apiKey) {
      throw new Error('MistralConversationalProvider requires an apiKey');
    }

    this.apiKey = options.apiKey;
    this.defaultModel = options.defaultModel ?? DEFAULT_MODEL;
    this.defaultVoiceId = options.defaultVoiceId ?? DEFAULT_VOICE;
    this.baseUrl = normalizeBaseUrl(options.serverURL ?? DEFAULT_BASE_URL);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.sttProvider =
      options.sttProvider ??
      new MistralSttProvider({
        apiKey: options.apiKey,
        defaultModel: options.sttOptions?.defaultModel,
        defaultLanguage: options.sttOptions?.defaultLanguage,
        serverURL: options.sttOptions?.serverURL ?? options.serverURL,
        fetchImpl: this.fetchImpl,
      });
  }

  async startSession(
    config: ConversationalSessionConfig
  ): Promise<ConversationalSession> {
    return new MistralConversationSession({
      sessionConfig: {
        ...config,
        voiceId: config.voiceId || this.defaultVoiceId,
      },
      defaultModel: this.defaultModel,
      complete: (history, sessionConfig) =>
        this.completeConversation(history, sessionConfig),
      sttProvider: this.sttProvider,
    });
  }

  async listVoices(): Promise<Voice[]> {
    return [
      {
        id: this.defaultVoiceId,
        name: 'Mistral Default Voice',
        description: 'Default conversational voice profile.',
        capabilities: ['conversational'],
      },
    ];
  }

  private async completeConversation(
    history: ConversationMessage[],
    sessionConfig: ConversationalSessionConfig
  ): Promise<string> {
    const model = sessionConfig.llmModel ?? this.defaultModel;
    const messages = [] as { role: string; content: string }[];

    if (sessionConfig.systemPrompt) {
      messages.push({ role: 'system', content: sessionConfig.systemPrompt });
    }

    for (const item of history) {
      messages.push({ role: item.role, content: item.content });
    }

    const response = await this.fetchImpl(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Mistral conversational request failed (${response.status}): ${body}`
      );
    }

    const payload = (await response.json()) as unknown;
    return readAssistantText(payload);
  }
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function readAssistantText(payload: unknown): string {
  const record = asRecord(payload);
  const choices = Array.isArray(record.choices) ? record.choices : [];
  const firstChoice = asRecord(choices[0]);
  const message = asRecord(firstChoice.message);

  if (typeof message.content === 'string') {
    return message.content;
  }

  if (Array.isArray(message.content)) {
    const textParts = message.content
      .map((part) => {
        const entry = asRecord(part);
        const text = entry.text;
        return typeof text === 'string' ? text : '';
      })
      .filter((text) => text.length > 0);
    return textParts.join('');
  }

  return '';
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return {};
}
