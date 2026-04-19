import path from 'node:path';
import type { FolderConventions } from '@contractspec/lib.contracts-spec';
import {
	type AuthoringContractSpecType,
	getAuthoringTargetDefaultFileName,
	getAuthoringTargetDefaultSubdirectory,
	getAuthoringTargetDefinitions,
} from '@contractspec/module.workspace';

export function getCreateQuickPickItems(): Array<{
	label: string;
	description: string;
	detail: string;
	value: AuthoringContractSpecType;
}> {
	return getAuthoringTargetDefinitions()
		.filter((definition) => definition.posture === 'file')
		.map((definition) => ({
			label: definition.title,
			description: definition.id,
			detail: `Create a ${definition.title.toLowerCase()} contract scaffold`,
			value: definition.id as AuthoringContractSpecType,
		}));
}

export function buildDefaultCreatePath(
	workspaceRoot: string,
	outputDir: string | undefined,
	specType: AuthoringContractSpecType,
	inputs: {
		key: string;
		kind?: 'command' | 'query';
		locale?: string;
	},
	conventions: Partial<FolderConventions>
): string {
	const baseDir = path.resolve(workspaceRoot, outputDir ?? './src');
	const defaultDir = path.join(
		baseDir,
		getAuthoringTargetDefaultSubdirectory(specType, conventions, {
			operationKind: inputs.kind,
			translationLocale: inputs.locale,
		})
	);
	const defaultFileName = getAuthoringTargetDefaultFileName(
		specType,
		inputs.key,
		{
			operationKind: inputs.kind,
			translationLocale: inputs.locale,
		}
	);
	return path.join(defaultDir, defaultFileName);
}
