export function isoNow(now: () => Date = () => new Date()): string {
	return now().toISOString();
}
