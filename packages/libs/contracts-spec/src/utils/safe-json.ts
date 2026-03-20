/**
 * Safe JSON parsing utilities for defensive handling of external data.
 */

export function safeParseJson<T = unknown>(
	text: string
): { ok: true; data: T } | { ok: false; error: Error } {
	try {
		const data = JSON.parse(text) as T;
		return { ok: true, data };
	} catch (e) {
		return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
	}
}
