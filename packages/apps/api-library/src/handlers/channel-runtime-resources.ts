import type { ChannelRuntimeStore } from '@contractspec/integration.runtime/channel';
import {
	createRuntimeResources,
	type RuntimeResources,
} from './channel-runtime-resources.factory';
import { resetSenderResolverForTests } from './channel-sender-resolver';
import { clearWorkspaceMapCacheForTests } from './channel-workspace-resolver';

let runtimeResources: RuntimeResources | null = null;
let runtimeResourcesPromise: Promise<RuntimeResources> | null = null;

export async function getChannelRuntimeResources(): Promise<RuntimeResources> {
	if (runtimeResources) {
		await runtimeResources.initializePromise;
		return runtimeResources;
	}
	if (!runtimeResourcesPromise) {
		runtimeResourcesPromise = createRuntimeResources()
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

export function resetChannelRuntimeResourcesForTests(): void {
	runtimeResources = null;
	runtimeResourcesPromise = null;
	resetSenderResolverForTests();
	clearWorkspaceMapCacheForTests();
}

export function getChannelRuntimeStoreForTests(): ChannelRuntimeStore | null {
	return runtimeResources?.store ?? null;
}
