import type {
  VoiceSynthesisInput,
  VoiceSynthesisResult,
} from '@contractspec/lib.contracts-integrations';

import {
  createVoiceProvider,
  type VoiceProviderFactoryInput,
} from './create-provider';

export interface SynthesizeVoiceInput extends VoiceProviderFactoryInput {
  synthesis: VoiceSynthesisInput;
}

export async function synthesizeVoice(
  input: SynthesizeVoiceInput
): Promise<VoiceSynthesisResult> {
  const provider = createVoiceProvider(input);
  return provider.synthesize(input.synthesis);
}
