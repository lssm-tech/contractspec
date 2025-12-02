import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'OpenAI Integration: ContractSpec Docs',
  description:
    'Use GPT models, embeddings, and Whisper speech-to-text with OpenAI in ContractSpec.',
};

export default function OpenAIIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">OpenAI</h1>
        <p className="text-muted-foreground">
          Integrate OpenAI's powerful AI models for chat completion, embeddings,
          and speech-to-text. Build intelligent features with GPT-4, generate
          embeddings for semantic search, and transcribe audio with Whisper.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION=org-...`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Chat completions</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: openai-chat
provider:
  type: openai
  operation: chatCompletion

inputs:
  messages:
    type: array
    items:
      type: object
      properties:
        role: string
        content: string
  model:
    type: string
    default: "gpt-4"
  temperature:
    type: number
    default: 0.7
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
          <pre>{`capabilityId: openai-embeddings
provider:
  type: openai
  operation: createEmbedding

inputs:
  text:
    type: string
  model:
    type: string
    default: "text-embedding-3-small"

outputs:
  embedding:
    type: array
    items:
      type: number`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Whisper (Speech-to-Text)</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: openai-transcribe
provider:
  type: openai
  operation: transcribe

inputs:
  audioFile:
    type: file
  language:
    type: string
    optional: true

outputs:
  text:
    type: string
  language:
    type: string`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Use streaming for real-time chat responses</li>
          <li>Cache embeddings to reduce API costs</li>
          <li>Implement rate limiting to avoid quota issues</li>
          <li>Store conversation history for context</li>
          <li>Monitor token usage and costs</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/google-calendar" className="btn-ghost">
          Previous: Google Calendar
        </Link>
        <Link href="/docs/integrations/elevenlabs" className="btn-primary">
          Next: ElevenLabs <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
