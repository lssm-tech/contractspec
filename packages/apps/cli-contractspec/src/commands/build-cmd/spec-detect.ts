import type { AuthoringTargetId } from '@contractspec/module.workspace';
import { detectAuthoringTarget } from '@contractspec/module.workspace';

export type SpecBuildType = AuthoringTargetId | 'unknown';

export function detectSpecType(
	specFile: string,
	specCode: string
): SpecBuildType {
	return detectAuthoringTarget(specCode, specFile);
}
