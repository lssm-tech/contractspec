import { describe, expect, it } from "bun:test";
import { AgentRegistry, createAgentRegistry, defineAgent } from "./index";

describe("AgentRegistry", () => {
	it("is available from the agent barrel", () => {
		const registry = createAgentRegistry();

		expect(registry).toBeInstanceOf(AgentRegistry);
	});

	it("returns versions in ascending semver order", () => {
		const registry = new AgentRegistry([
			defineAgent({
				meta: {
					key: "support.bot",
					version: "2.0.0",
					description: "Support bot",
					owners: ["platform"],
					tags: [],
					stability: "experimental",
				},
				instructions: "Help users.",
				tools: [{ name: "search" }],
			}),
			defineAgent({
				meta: {
					key: "support.bot",
					version: "1.0.0",
					description: "Support bot",
					owners: ["platform"],
					tags: [],
					stability: "experimental",
				},
				instructions: "Help users.",
				tools: [{ name: "search" }],
			}),
		]);

		expect(registry.listNames()).toEqual(["support.bot"]);
		expect(registry.getVersions("support.bot").map((spec) => spec.meta.version)).toEqual([
			"1.0.0",
			"2.0.0",
		]);
		expect(() => registry.require("missing")).toThrow(/Agent spec not found/i);
	});
});
