import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "ElevenLabs Integration: ContractSpec Docs",
  description:
    "Generate realistic text-to-speech audio with ElevenLabs in ContractSpec.",
};

export default function ElevenLabsIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">ElevenLabs</h1>
        <p className="text-muted-foreground">
          ElevenLabs provides state-of-the-art text-to-speech and voice cloning
          technology. Create natural-sounding voiceovers, audiobooks, and voice
          assistants.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <div className="bg-background/50 p-4 rounded-lg border border-border font-mono text-sm text-muted-foreground overflow-x-auto">
          <pre>{`# .env
ELEVENLABS_API_KEY=...`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Text-to-Speech</h2>
        <div className="bg-background/50 p-4 rounded-lg border border-border font-mono text-sm text-muted-foreground overflow-x-auto">
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
        <h2 className="text-2xl font-bold">Use cases</h2>
        <ul className="space-y-2 text-muted-foreground list-disc list-inside">
          <li>Generate voiceovers for videos</li>
          <li>Create audio versions of articles</li>
          <li>Build voice assistants</li>
          <li>Produce audiobooks</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations/openai" className="btn-ghost">
          Previous: OpenAI
        </Link>
        <Link href="/docs/integrations/qdrant" className="btn-primary">
          Next: Qdrant <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

