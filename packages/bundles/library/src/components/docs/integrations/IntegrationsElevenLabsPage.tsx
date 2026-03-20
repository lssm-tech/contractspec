import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'ElevenLabs Integration: ContractSpec Docs',
//   description:
//     'Generate realistic text-to-speech audio with ElevenLabs in ContractSpec.',
// };

export function IntegrationsElevenLabsPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">ElevenLabs</h1>
				<p className="text-muted-foreground">
					ElevenLabs provides state-of-the-art text-to-speech and voice cloning
					technology. Create natural-sounding voiceovers, audiobooks, and voice
					assistants.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Setup</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`# .env
ELEVENLABS_API_KEY=...`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Text-to-Speech</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`capabilityId: elevenlabs-tts
provider:
  type: elevenlabs
  operation: textToSpeech

inputs:
  text:
    type: string
  voiceId:
    type: string
    default: "21m00Tcm4TlvDq8ikWAM"
  modelId:
    type: string
    default: "eleven_monolingual_v1"

outputs:
  audioUrl:
    type: string
  audioData:
    type: buffer`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Use cases</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>Generate voiceovers for videos</li>
					<li>Create audio versions of articles</li>
					<li>Build voice assistants</li>
					<li>Produce audiobooks</li>
				</ul>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/integrations/mistral" className="btn-ghost">
					Previous: Mistral
				</Link>
				<Link href="/docs/integrations/qdrant" className="btn-primary">
					Next: Qdrant <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
