import type { ExecutionLaneSpec, LaneKey } from '../types';
import { assertValid } from '../validation/issues';
import { validateExecutionLaneSpec } from '../validation/lane-spec';

export class ExecutionLaneRegistry {
	private readonly items = new Map<LaneKey, ExecutionLaneSpec>();

	register(spec: ExecutionLaneSpec): this {
		assertValid(
			validateExecutionLaneSpec(spec),
			`Invalid execution lane spec "${spec.key}"`
		);
		this.items.set(spec.key, spec);
		return this;
	}

	get(key: LaneKey): ExecutionLaneSpec | undefined {
		return this.items.get(key);
	}

	list(): ExecutionLaneSpec[] {
		return Array.from(this.items.values());
	}

	canTransition(from: LaneKey, to: LaneKey): boolean {
		const spec = this.items.get(from);
		return spec ? spec.allowedTransitions.includes(to) : false;
	}
}

export function defineExecutionLane(
	spec: ExecutionLaneSpec
): ExecutionLaneSpec {
	assertValid(
		validateExecutionLaneSpec(spec),
		`Invalid execution lane spec "${spec.key}"`
	);
	return spec;
}
