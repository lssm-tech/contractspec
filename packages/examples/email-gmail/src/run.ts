import { fetchGmailInboundSnapshot } from './inbound';
import {
  buildSampleOutboundMessage,
  sendGmailOutboundSample,
} from './outbound';

type EmailMode = 'inbound' | 'outbound' | 'both';

export async function runGmailExampleFromEnv() {
  const mode = resolveEmailMode();
  const dryRun = process.env.CONTRACTSPEC_EMAIL_DRY_RUN === 'true';
  const output: Record<string, unknown> = { mode, dryRun };

  if (mode === 'inbound' || mode === 'both') {
    output.inbound = dryRun
      ? { hint: 'Dry run enabled. Set CONTRACTSPEC_EMAIL_DRY_RUN=false.' }
      : await fetchGmailInboundSnapshot();
  }

  if (mode === 'outbound' || mode === 'both') {
    output.outbound = dryRun
      ? { message: buildSampleOutboundMessage() }
      : await sendGmailOutboundSample();
  }

  return output;
}

export function resolveEmailMode(): EmailMode {
  const raw = (process.env.CONTRACTSPEC_EMAIL_MODE ?? 'both').toLowerCase();
  if (raw === 'inbound' || raw === 'outbound' || raw === 'both') return raw;
  throw new Error(
    `Unsupported CONTRACTSPEC_EMAIL_MODE: ${raw}. Use inbound, outbound, or both.`
  );
}

runGmailExampleFromEnv()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
