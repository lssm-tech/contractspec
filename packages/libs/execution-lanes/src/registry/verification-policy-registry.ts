import type { VerificationPolicy, VerificationPolicySource } from '../types';
import { assertValidVerificationPolicy } from '../validation/verification-policy';

export class VerificationPolicyRegistry {
	private readonly items = new Map<string, VerificationPolicy>();

	register(policy: VerificationPolicy): this {
		assertValidPolicy(policy);
		this.items.set(policy.key, policy);
		return this;
	}

	get(key: string): VerificationPolicy | undefined {
		return this.items.get(key);
	}

	require(key: string): VerificationPolicy {
		const policy = this.get(key);
		if (!policy) {
			throw new Error(`Missing verification policy "${key}".`);
		}
		return policy;
	}

	resolve(source: VerificationPolicySource): VerificationPolicy {
		return resolveVerificationPolicySource(source, this);
	}

	list(): VerificationPolicy[] {
		return Array.from(this.items.values());
	}
}

export function resolveVerificationPolicySource(
	source: VerificationPolicySource,
	registry?: VerificationPolicyRegistry
): VerificationPolicy {
	if (typeof source !== 'string') {
		assertValidPolicy(source);
		return source;
	}
	if (!registry) {
		throw new Error(
			`Verification policy "${source}" requires a registry for resolution.`
		);
	}
	return registry.require(source);
}

function assertValidPolicy(policy: VerificationPolicy) {
	assertValidVerificationPolicy(policy);
}
