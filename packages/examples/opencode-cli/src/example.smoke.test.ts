import { describe, expect, test } from "bun:test";
import { OpenCodeEchoCommand } from "./contracts/opencode.contracts";
import example from "./example";
import { OpenCodeCliFeature } from "./opencode-cli.feature";

describe("@contractspec/example.opencode-cli smoke", () => {
	test("publishes stable CLI metadata", () => {
		expect(example.meta.stability).toBe("stable");
		expect(example.entrypoints.packageName).toBe(
			"@contractspec/example.opencode-cli"
		);
		expect(example.surfaces.templates).toBe(false);
		expect(OpenCodeCliFeature.meta.stability).toBe("stable");
		expect(OpenCodeCliFeature.operations?.[0]?.key).toBe(
			OpenCodeEchoCommand.meta.key
		);
	});
});
