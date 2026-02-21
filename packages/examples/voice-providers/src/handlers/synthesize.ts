import type {
  TTSSynthesisInput,
  TTSSynthesisResult,
} from '@contractspec/lib.contracts-integrations';

import {
  createVoiceProvider,
  type VoiceProviderFactoryInput,
} from './create-provider';

export interface SynthesizeVoiceInput extends VoiceProviderFactoryInput {
  synthesis: TTSSynthesisInput;
}

export async function synthesizeVoice(
  input: SynthesizeVoiceInput
): Promise<TTSSynthesisResult> {
  const provider = createVoiceProvider(input);
  return provider.synthesize(input.synthesis);
}
