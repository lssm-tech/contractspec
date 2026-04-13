import type { Command } from 'commander';

export const CATEGORY_ESSENTIALS = 'Essentials';
export const CATEGORY_DEVELOPMENT = 'Development';
export const CATEGORY_TESTING = 'Testing & Quality';
export const CATEGORY_AI = 'AI & Assistants';
export const CATEGORY_OPERATIONS = 'Operations';
export const CATEGORY_INTEGRATION = 'Integration';
export const CATEGORY_ECOSYSTEM = 'Ecosystem';
export const CATEGORY_OTHER = 'Other';

export const CATEGORY_ORDER = [
	CATEGORY_ESSENTIALS,
	CATEGORY_DEVELOPMENT,
	CATEGORY_TESTING,
	CATEGORY_AI,
	CATEGORY_OPERATIONS,
	CATEGORY_INTEGRATION,
	CATEGORY_ECOSYSTEM,
	CATEGORY_OTHER,
];

export function withCategory(cmd: Command, category: string): Command {
	(cmd as Command & { category: string }).category = category;
	return cmd;
}
