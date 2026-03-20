import { describe, expect, test } from "bun:test";
import { buildMessagingAgentActionsMeetupProof } from "./proof/meetup-proof";

describe("messaging-agent-actions meetup proof", () => {
	test("captures the canonical status, action, and workflow walkthrough", async () => {
		const proof = await buildMessagingAgentActionsMeetupProof();

		expect(proof.exampleKey).toBe("messaging-agent-actions");
		expect(proof.allowedActions).toContain("refresh-agent-console-proof");
		expect(proof.allowedWorkflows).toContain("incident-triage");
		expect(proof.replay).toHaveLength(3);
		expect(proof.replay[0]?.intent).toBe("status");
		expect(proof.replay[1]?.intent).toBe("run_action");
		expect(proof.replay[2]?.intent).toBe("dispatch_workflow");
	});
});
