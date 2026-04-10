import { randomUUID } from 'crypto';

export function createBuilderId(prefix: string): string {
	return `${prefix}_${randomUUID().replace(/-/g, '')}`;
}
