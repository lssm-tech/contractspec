import type { Voice } from '@contractspec/lib.contracts/integrations/providers/voice';

import {
  createVoiceProvider,
  type VoiceProviderFactoryInput,
} from './create-provider';

export async function listVoices(
  input: VoiceProviderFactoryInput
): Promise<Voice[]> {
  const provider = createVoiceProvider(input);
  return provider.listVoices();
}
