import { defineExample } from "@contractspec/lib.contracts-spec";

const example = defineExample({
	meta: {
		key: "messaging-agent-actions",
		version: "1.0.0",
		title: "Messaging Agent Actions",
		description:
			"Provider-friendly messaging example for fixed intent classification, allowlisted action execution, workflow dispatch, and outbound confirmations.",
		kind: "integration",
		visibility: "public",
		stability: "beta",
		owners: ["@platform.messaging"],
		tags: ["messaging", "agents", "telegram", "slack", "whatsapp"],
		summary:
			"Live-provider messaging demo with safe action routing and deterministic proof coverage.",
	},
	docs: {
		rootDocId: "docs.examples.messaging-agent-actions",
		goalDocId: "docs.examples.messaging-agent-actions.goal",
		usageDocId: "docs.examples.messaging-agent-actions.usage",
	},
	entrypoints: {
		packageName: "@contractspec/example.messaging-agent-actions",
		feature: "./messaging-agent-actions.feature",
		contracts: "./contracts",
		handlers: "./handlers",
		docs: "./docs",
	},
	surfaces: {
		templates: true,
		sandbox: {
			enabled: true,
			modes: ["playground", "specs", "markdown"],
		},
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
});

export default example;
