import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function IntegrationsMistralPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Mistral</h1>
        <p className="text-muted-foreground">
          Integrate Mistral models for chat, reasoning, embeddings,
          speech-to-text, and conversational voice workflows. ContractSpec ships
          first-class Mistral support across contracts, provider runtime wiring,
          and CLI provider selection.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
MISTRAL_API_KEY=...`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Chat and reasoning</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: mistral-chat
provider:
  type: mistral
  operation: chatCompletion

inputs:
  messages:
    type: array
  model:
    type: string
    default: "mistral-large-latest"
  temperature:
    type: number
    optional: true

outputs:
  content:
    type: string
  usage:
    type: object`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Embeddings</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: mistral-embeddings
provider:
  type: mistral
  operation: createEmbedding

inputs:
  text:
    type: string
  model:
    type: string
    default: "mistral-embed"

outputs:
  embedding:
    type: array
    items:
      type: number`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Speech-to-Text (Voxtral)</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: mistral-stt
provider:
  type: mistral
  operation: transcribe

inputs:
  audio:
    type: bytes
  format:
    type: string
  language:
    type: string
    optional: true

outputs:
  text:
    type: string
  segments:
    type: array
  language:
    type: string`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Conversational voice sessions</h2>
        <p className="text-muted-foreground">
          Use the conversational provider for session-based realtime voice flows
          (turn handling, events, and interruption-safe streaming).
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Choose model families by workload: coding, reasoning, or speech
          </li>
          <li>
            Persist session IDs for conversational continuity across turns
          </li>
          <li>Capture token and latency telemetry for provider-level tuning</li>
          <li>Set explicit fallbacks for network and rate-limit failures</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/openai" className="btn-ghost">
          Previous: OpenAI
        </Link>
        <Link href="/docs/integrations/elevenlabs" className="btn-primary">
          Next: ElevenLabs <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
