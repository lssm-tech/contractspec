'use server';

import type { OverlaySpec } from '@contractspec/lib.overlay-engine';
import { signOverlay } from '@contractspec/lib.overlay-engine';

export async function signOverlayFromForm(
  _: unknown,
  formData: FormData
): Promise<{ signed?: null | OverlaySpec; error?: null | string }> {
  const payload = formData.get('overlay')?.toString();
  const privateKey = formData.get('privateKey')?.toString() ?? '';
  if (!payload) {
    return { error: 'Missing overlay payload' };
  }
  if (!privateKey.trim()) {
    return { error: 'Private key is required' };
  }
  const parsed = JSON.parse(payload) as OverlaySpec;
  const signed = await signOverlay(parsed, privateKey);
  return { signed };
}
