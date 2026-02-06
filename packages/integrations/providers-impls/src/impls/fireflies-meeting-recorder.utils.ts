import { Buffer } from 'node:buffer';
import { timingSafeEqual } from 'crypto';

export function parseSeconds(
  value?: string | number | null
): number | undefined {
  if (value == null) return undefined;
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return undefined;
  return num * 1000;
}

export function normalizeHeader(
  headers: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const header =
    headers[key] ?? headers[key.toLowerCase()] ?? headers[key.toUpperCase()];
  if (Array.isArray(header)) return header[0];
  return header;
}

export function safeCompareHex(a: string, b: string): boolean {
  try {
    const aBuffer = Buffer.from(a, 'hex');
    const bBuffer = Buffer.from(b, 'hex');
    if (aBuffer.length !== bBuffer.length) return false;
    return timingSafeEqual(aBuffer, bBuffer);
  } catch {
    return false;
  }
}

export async function safeReadError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data?.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}
