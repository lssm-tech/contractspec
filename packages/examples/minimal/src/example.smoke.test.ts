import { describe, expect, test } from "bun:test";
import { CreateUser } from "./contracts/user";
import example from "./example";
import { MinimalFeature } from "./minimal.feature";

describe("@contractspec/example.minimal smoke", () => {
	test("publishes stable starter metadata", () => {
		expect(example.meta.stability).toBe("stable");
		expect(example.entrypoints.packageName).toBe("@contractspec/example.minimal");
		expect(example.surfaces.templates).toBe(true);
		expect(MinimalFeature.meta.stability).toBe("stable");
		expect(MinimalFeature.operations?.[0]?.key).toBe(CreateUser.meta.key);
	});
});
