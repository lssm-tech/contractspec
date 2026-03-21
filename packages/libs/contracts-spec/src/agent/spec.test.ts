import { describe, expect, it } from "bun:test";
import { type AgentSpec, defineAgent } from "./spec";

function makeSpec(overrides: Partial<AgentSpec> = {}): AgentSpec {
	return {
		meta: {
			key: "agent.spec.test",
			version: "1.0.0",
			description: "Spec test description",
			owners: ["platform"],
			tags: [],
			stability: "experimental",
		},
		instructions: "Execute test operations.",
		tools: [
			{
				name: "ping",
			},
		],
		...overrides,
	};
}

describe("defineAgent", () => {
	it("accepts runtime adapter configuration", () => {
		const spec = defineAgent(
			makeSpec({
				runtime: {
					capabilities: {
						adapters: {
							langgraph: true,
						},
						checkpointing: true,
					},
					ports: {
						checkpointStore: "memory.checkpoint",
					},
				},
			}),
		);

		expect(spec.runtime?.capabilities?.adapters?.langgraph).toBe(true);
	});

	it("rejects empty runtime ports", () => {
		expect(() =>
			defineAgent(
				makeSpec({
					runtime: {
						ports: {
							checkpointStore: " ",
						},
					},
				}),
			),
		).toThrow(/invalid runtime config/i);
	});
});
