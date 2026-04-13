import { join, relative } from 'node:path';

const CONTRACTSRC_SCHEMA_PACKAGE_NAME = 'contractspec';
const CONTRACTSRC_SCHEMA_FILE_NAME = 'contractsrc.schema.json';

function normalizeRelativePath(path: string): string {
	const normalizedPath = path.replaceAll('\\', '/');
	return normalizedPath.startsWith('.')
		? normalizedPath
		: `./${normalizedPath}`;
}

export function getBundledContractsrcSchemaRef(options: {
	configRoot: string;
	workspaceRoot: string;
}): string {
	return normalizeRelativePath(
		relative(
			options.configRoot,
			join(
				options.workspaceRoot,
				'node_modules',
				CONTRACTSRC_SCHEMA_PACKAGE_NAME,
				CONTRACTSRC_SCHEMA_FILE_NAME
			)
		)
	);
}
