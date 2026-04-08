import { unzipSync } from 'fflate';

const BLOCKED_EXTENSIONS = ['.exe', '.sh', '.bat', '.app', '.dmg', '.zip'];

export interface SafeZipEntry {
	path: string;
	content: Uint8Array;
}

export function expandSafeZipEntries(input: {
	content: Uint8Array;
	maxEntries?: number;
	maxTotalBytes?: number;
}): SafeZipEntry[] {
	const archive = unzipSync(input.content);
	const maxEntries = input.maxEntries ?? 100;
	const maxTotalBytes = input.maxTotalBytes ?? 10 * 1024 * 1024;
	const entries = Object.entries(archive);
	if (entries.length > maxEntries) {
		throw new Error('Zip bundle exceeds the maximum allowed entry count.');
	}

	let totalBytes = 0;
	return entries.map(([path, content]) => {
		const normalized = path.replace(/\\/g, '/');
		if (normalized.includes('..')) {
			throw new Error('Zip bundle contains unsafe traversal paths.');
		}
		if (
			BLOCKED_EXTENSIONS.some((extension) => normalized.endsWith(extension))
		) {
			throw new Error(`Zip bundle contains blocked entry type: ${normalized}`);
		}
		totalBytes += content.byteLength;
		if (totalBytes > maxTotalBytes) {
			throw new Error('Zip bundle exceeds the maximum allowed expanded size.');
		}
		return { path: normalized, content };
	});
}
