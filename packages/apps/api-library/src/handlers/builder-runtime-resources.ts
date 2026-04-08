import type { BuilderStore } from '@contractspec/lib.builder-runtime/stores';
import {
	type BuilderRuntimeResources,
	createBuilderRuntimeResources,
} from './builder-runtime-resources.factory';
import { clearWorkspaceMapCacheForTests } from './channel-workspace-resolver';

let runtimeResources: BuilderRuntimeResources | null = null;
let runtimeResourcesPromise: Promise<BuilderRuntimeResources> | null = null;

export async function getBuilderRuntimeResources(): Promise<BuilderRuntimeResources> {
	if (runtimeResources) {
		await runtimeResources.initializePromise;
		return runtimeResources;
	}
	if (!runtimeResourcesPromise) {
		runtimeResourcesPromise = createBuilderRuntimeResources()
			.then((resources) => {
				runtimeResources = resources;
				return resources;
			})
			.catch((error) => {
				runtimeResourcesPromise = null;
				throw error;
			});
	}
	const resources = await runtimeResourcesPromise;
	await resources.initializePromise;
	return resources;
}

export function resetBuilderRuntimeResourcesForTests(): void {
	runtimeResources = null;
	runtimeResourcesPromise = null;
	clearWorkspaceMapCacheForTests();
}

export function getBuilderRuntimeStoreForTests(): BuilderStore | null {
	return runtimeResources?.store ?? null;
}
