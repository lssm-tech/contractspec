import { randomUUID } from 'node:crypto';
import type { HarnessTargetResolver } from '../types';

export interface DefaultHarnessTargetResolverOptions {
	previewBaseUrl?: string;
	taskBaseUrl?: string;
	sharedBaseUrl?: string;
	sandboxBaseUrl?: string;
}

export class DefaultHarnessTargetResolver implements HarnessTargetResolver {
	constructor(
		private readonly options: DefaultHarnessTargetResolverOptions = {}
	) {}

	async resolve(request: Parameters<HarnessTargetResolver['resolve']>[0]) {
		const preferred = request.preferredTargets ?? [
			'preview',
			'task',
			'shared',
			'sandbox',
		];
		const selected =
			preferred.find(
				(kind: 'preview' | 'task' | 'shared' | 'sandbox') =>
					this.baseUrlFor(kind) != null
			) ?? 'shared';
		const baseUrl = request.baseUrl ?? this.baseUrlFor(selected);
		return {
			targetId: request.explicitTargetId ?? `${selected}-${randomUUID()}`,
			kind: selected,
			isolation: request.isolation ?? selected,
			environment: selected,
			baseUrl,
			allowlistedDomains:
				request.allowlistedDomains ??
				(baseUrl ? [new URL(baseUrl).hostname] : undefined),
			metadata: request.metadata,
		};
	}

	private baseUrlFor(kind: 'preview' | 'task' | 'shared' | 'sandbox') {
		switch (kind) {
			case 'preview':
				return this.options.previewBaseUrl;
			case 'task':
				return this.options.taskBaseUrl;
			case 'shared':
				return this.options.sharedBaseUrl;
			case 'sandbox':
				return this.options.sandboxBaseUrl;
			default:
				return undefined;
		}
	}
}
