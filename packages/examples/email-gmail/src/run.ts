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
      ? { message: await buildSampleOutboundMessage() }
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
    const hint = formatAuthScopeError(error);
    if (hint) {
      console.error(hint);
    }
    console.error(error);
    process.exitCode = 1;
  });

function formatAuthScopeError(error: unknown): string | null {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("Metadata scope doesn't allow format FULL")) {
    return [
      'Gmail scope error: your refresh token was created with gmail.metadata only.',
      'Regenerate a refresh token with gmail.modify (or gmail.readonly for inbound only).',
      'Then retry the example.',
    ].join('\n');
  }
  if (message.includes('insufficient_scope')) {
    return [
      'Gmail scope error: insufficient OAuth scopes for the requested operation.',
      'Regenerate a refresh token with gmail.modify or gmail.readonly.',
    ].join('\n');
  }
  return null;
}
