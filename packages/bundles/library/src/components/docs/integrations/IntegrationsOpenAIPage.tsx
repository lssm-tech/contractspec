import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'OpenAI Integration: ContractSpec Docs',
//   description:
//     'Use GPT models, embeddings, and Whisper speech-to-text with OpenAI in ContractSpec.',
// };

export function IntegrationsOpenAIPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">OpenAI</h1>
				<p className="text-muted-foreground">
					Integrate OpenAI's powerful AI models for chat completion, embeddings,
					and speech-to-text. Build intelligent features with GPT-4, generate
					embeddings for semantic search, and transcribe audio with Whisper.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Setup</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`# .env
OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION=org-...`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Chat completions</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
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
				<h2 className="font-bold text-2xl">Embeddings</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
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
				<h2 className="font-bold text-2xl">Whisper (Speech-to-Text)</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
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
				<h2 className="font-bold text-2xl">Best practices</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
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
				<Link href="/docs/integrations/mistral" className="btn-primary">
					Next: Mistral <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
