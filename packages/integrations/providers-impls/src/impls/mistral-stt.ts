import type {
  AudioFormat,
  STTProvider,
  STTTranscriptionInput,
  STTTranscriptionResult,
  TranscriptionSegment,
  WordTiming,
} from '../voice';

export interface MistralSttProviderOptions {
  apiKey: string;
  defaultModel?: string;
  defaultLanguage?: string;
  serverURL?: string;
  fetchImpl?: typeof fetch;
}

const DEFAULT_BASE_URL = 'https://api.mistral.ai/v1';
const DEFAULT_MODEL = 'voxtral-mini-latest';

const AUDIO_MIME_BY_FORMAT: Record<AudioFormat, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  pcm: 'audio/pcm',
  opus: 'audio/opus',
};

export class MistralSttProvider implements STTProvider {
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly defaultLanguage?: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: MistralSttProviderOptions) {
    if (!options.apiKey) {
      throw new Error('MistralSttProvider requires an apiKey');
    }

    this.apiKey = options.apiKey;
    this.defaultModel = options.defaultModel ?? DEFAULT_MODEL;
    this.defaultLanguage = options.defaultLanguage;
    this.baseUrl = normalizeBaseUrl(options.serverURL ?? DEFAULT_BASE_URL);
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async transcribe(
    input: STTTranscriptionInput
  ): Promise<STTTranscriptionResult> {
    const formData = new FormData();
    const model = input.model ?? this.defaultModel;

    const mimeType = AUDIO_MIME_BY_FORMAT[input.audio.format] ?? 'audio/wav';
    const fileName = `audio.${input.audio.format}`;
    const audioBytes = new Uint8Array(input.audio.data);
    const blob = new Blob([audioBytes], { type: mimeType });

    formData.append('file', blob, fileName);
    formData.append('model', model);
    formData.append('response_format', 'verbose_json');

    const language = input.language ?? this.defaultLanguage;
    if (language) {
      formData.append('language', language);
    }

    const response = await this.fetchImpl(
      `${this.baseUrl}/audio/transcriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Mistral transcription request failed (${response.status}): ${body}`
      );
    }

    const payload = (await response.json()) as unknown;
    return toTranscriptionResult(payload, input);
  }
}

function toTranscriptionResult(
  payload: unknown,
  input: STTTranscriptionInput
): STTTranscriptionResult {
  const record = asRecord(payload);

  const text = readString(record, 'text') ?? '';
  const language =
    readString(record, 'language') ?? input.language ?? 'unknown';
  const segments = parseSegments(record);

  if (segments.length === 0 && text.length > 0) {
    segments.push({
      text,
      startMs: 0,
      endMs: input.audio.durationMs ?? 0,
    });
  }

  const durationMs =
    input.audio.durationMs ??
    segments.reduce((max, segment) => Math.max(max, segment.endMs), 0);

  const topLevelWords = parseWordTimings(record.words);
  const flattenedWords = segments.flatMap(
    (segment) => segment.wordTimings ?? []
  );
  const wordTimings =
    topLevelWords.length > 0
      ? topLevelWords
      : flattenedWords.length > 0
        ? flattenedWords
        : undefined;

  const speakers = dedupeSpeakers(segments);

  return {
    text,
    segments,
    language,
    durationMs,
    speakers: speakers.length > 0 ? speakers : undefined,
    wordTimings,
  };
}

function parseSegments(
  record: Record<string, unknown>
): TranscriptionSegment[] {
  if (!Array.isArray(record.segments)) {
    return [];
  }

  const parsed: TranscriptionSegment[] = [];
  for (const entry of record.segments) {
    const segmentRecord = asRecord(entry);
    const text = readString(segmentRecord, 'text');
    if (!text) {
      continue;
    }

    const startSeconds = readNumber(segmentRecord, 'start') ?? 0;
    const endSeconds = readNumber(segmentRecord, 'end') ?? startSeconds;

    parsed.push({
      text,
      startMs: secondsToMs(startSeconds),
      endMs: secondsToMs(endSeconds),
      speakerId: readString(segmentRecord, 'speaker') ?? undefined,
      confidence: readNumber(segmentRecord, 'confidence'),
      wordTimings: parseWordTimings(segmentRecord.words),
    });
  }

  return parsed;
}

function parseWordTimings(value: unknown): WordTiming[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const words: WordTiming[] = [];
  for (const entry of value) {
    const wordRecord = asRecord(entry);
    const word = readString(wordRecord, 'word');
    const startSeconds = readNumber(wordRecord, 'start');
    const endSeconds = readNumber(wordRecord, 'end');

    if (!word || startSeconds == null || endSeconds == null) {
      continue;
    }

    words.push({
      word,
      startMs: secondsToMs(startSeconds),
      endMs: secondsToMs(endSeconds),
      confidence: readNumber(wordRecord, 'confidence'),
    });
  }

  return words;
}

function dedupeSpeakers(segments: TranscriptionSegment[]) {
  const seen = new Set<string>();
  const speakers: { id: string; name?: string }[] = [];
  for (const segment of segments) {
    if (!segment.speakerId || seen.has(segment.speakerId)) {
      continue;
    }
    seen.add(segment.speakerId);
    speakers.push({
      id: segment.speakerId,
      name: segment.speakerName,
    });
  }
  return speakers;
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return {};
}

function readString(
  record: Record<string, unknown>,
  key: string
): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function readNumber(
  record: Record<string, unknown>,
  key: string
): number | undefined {
  const value = record[key];
  return typeof value === 'number' ? value : undefined;
}

function secondsToMs(value: number): number {
  return Math.round(value * 1000);
}
