import { describe, expect, it, mock } from 'bun:test';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import { updateSpec } from './update';

describe('updateSpec', () => {
	it('applies structured field patches to nested object properties', async () => {
		let currentCode = `export const WorkspaceBundle = defineModuleBundle({
  meta: {
    key: "workspace.bundle",
    version: "1.0.0",
    title: "Workspace",
  },
  routes: [],
  surfaces: {},
});
`;

		const fs: FsAdapter = {
			exists: async () => true,
			readFile: async () => currentCode,
			writeFile: async (_path, content) => {
				currentCode = content;
			},
			remove: async () => {},
			stat: async () =>
				({
					size: currentCode.length,
					isFile: true,
					isDirectory: false,
					mtime: new Date(),
				}) as never,
			mkdir: async () => {},
			glob: async () => [],
			resolve: (...parts) => parts.join('/'),
			dirname: (value) => value.split('/').slice(0, -1).join('/'),
			basename: (value) => value.split('/').pop() ?? value,
			join: (...parts) => parts.join('/'),
			relative: (_from, to) => to,
		};
		const logger: LoggerAdapter = {
			info: mock(),
			warn: mock(),
			error: mock(),
			debug: mock(),
			createProgress: mock(),
		} as never;

		const result = await updateSpec(
			'src/workspace.bundle.ts',
			{ fs, logger },
			{
				fields: [
					{ key: 'meta.title', value: 'Workspace Builder' },
					{ key: 'meta.description', value: 'Builder-first workspace bundle' },
				],
				skipValidation: true,
			}
		);

		expect(result.updated).toBe(true);
		expect(currentCode).toContain('title: "Workspace Builder"');
		expect(currentCode).toContain(
			'description: "Builder-first workspace bundle"'
		);
	});
});
