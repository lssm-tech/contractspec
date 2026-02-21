import { listVoices } from './handlers/list-voices';
import { synthesizeVoice } from './handlers/synthesize';
import type {
  VoiceIntegrationKey,
  VoiceProviderConfig,
  VoiceProviderFactoryInput,
} from './handlers/create-provider';

type VoiceMode = 'list' | 'synthesize' | 'both';

export async function runVoiceProvidersExampleFromEnv() {
  const integrationKey = resolveIntegrationKey();
  const mode = resolveMode();
  const dryRun = process.env.CONTRACTSPEC_VOICE_DRY_RUN === 'true';
  const config = resolveConfig(integrationKey);
  const text =
    process.env.CONTRACTSPEC_VOICE_TEXT ??
    'Hello from ContractSpec voice providers example.';
  const voiceId = process.env.CONTRACTSPEC_VOICE_ID;

  if (dryRun) {
    return {
      integrationKey,
      mode,
      dryRun,
      text,
      voiceId,
      config,
    };
  }

  const input: VoiceProviderFactoryInput = {
    integrationKey,
    secrets: {
      apiKey: resolveApiKey(integrationKey),
    },
    config,
  };

  const output: Record<string, unknown> = {
    integrationKey,
    mode,
    dryRun,
  };

  if (mode === 'list' || mode === 'both') {
    const voices = await listVoices(input);
    output.voices = voices;
  }

  if (mode === 'synthesize' || mode === 'both') {
    const result = await synthesizeVoice({
      ...input,
      synthesis: {
        text,
        voiceId: voiceId ?? 'default',
      },
    });
    output.synthesis = {
      format: result.audio.format,
      sampleRateHz: result.audio.sampleRateHz,
      bytes: result.audio.data.length,
      durationMs: result.audio.durationMs,
    };
  }

  return output;
}

function resolveMode(): VoiceMode {
  const raw = (process.env.CONTRACTSPEC_VOICE_MODE ?? 'both').toLowerCase();
  if (raw === 'list' || raw === 'synthesize' || raw === 'both') {
    return raw;
  }
  throw new Error(
    `Unsupported CONTRACTSPEC_VOICE_MODE: ${raw}. Use list, synthesize, or both.`
  );
}

function resolveIntegrationKey(): VoiceIntegrationKey {
  const raw = (
    process.env.CONTRACTSPEC_VOICE_PROVIDER ?? 'gradium'
  ).toLowerCase();
  if (raw === 'gradium') return 'ai-voice.gradium';
  if (raw === 'fal') return 'ai-voice.fal';
  throw new Error(
    `Unsupported CONTRACTSPEC_VOICE_PROVIDER: ${raw}. Use gradium or fal.`
  );
}

function resolveApiKey(integrationKey: VoiceIntegrationKey): string {
  const shared = process.env.CONTRACTSPEC_VOICE_API_KEY;
  if (shared) return shared;

  const specific =
    integrationKey === 'ai-voice.gradium'
      ? process.env.GRADIUM_API_KEY
      : process.env.FAL_KEY;

  if (!specific) {
    const envName =
      integrationKey === 'ai-voice.gradium' ? 'GRADIUM_API_KEY' : 'FAL_KEY';
    throw new Error(
      `Missing API key. Set CONTRACTSPEC_VOICE_API_KEY or ${envName}.`
    );
  }

  return specific;
}

function resolveConfig(
  integrationKey: VoiceIntegrationKey
): VoiceProviderConfig {
  if (integrationKey === 'ai-voice.gradium') {
    const config: VoiceProviderConfig = {
      defaultVoiceId: process.env.GRADIUM_DEFAULT_VOICE_ID,
      region:
        process.env.GRADIUM_REGION === 'eu' ||
        process.env.GRADIUM_REGION === 'us'
          ? process.env.GRADIUM_REGION
          : undefined,
      baseUrl: process.env.GRADIUM_BASE_URL,
      timeoutMs: parseOptionalInt(process.env.GRADIUM_TIMEOUT_MS),
      outputFormat: parseGradiumOutputFormat(process.env.GRADIUM_OUTPUT_FORMAT),
    };
    return config;
  }

  return {
    modelId: process.env.FAL_MODEL_ID,
    defaultVoiceUrl: process.env.FAL_DEFAULT_VOICE_URL,
    defaultExaggeration: parseOptionalNumber(
      process.env.FAL_DEFAULT_EXAGGERATION
    ),
    defaultTemperature: parseOptionalNumber(
      process.env.FAL_DEFAULT_TEMPERATURE
    ),
    defaultCfg: parseOptionalNumber(process.env.FAL_DEFAULT_CFG),
    pollIntervalMs: parseOptionalInt(process.env.FAL_POLL_INTERVAL_MS),
  };
}

function parseOptionalInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseGradiumOutputFormat(
  value: string | undefined
): VoiceProviderConfig['outputFormat'] {
  if (!value) return undefined;
  switch (value) {
    case 'wav':
    case 'pcm':
    case 'opus':
    case 'ulaw_8000':
    case 'alaw_8000':
    case 'pcm_16000':
    case 'pcm_24000':
      return value;
    default:
      return undefined;
  }
}

runVoiceProvidersExampleFromEnv()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
