import { defineExample } from "@contractspec/lib.contracts-spec";

const example = defineExample({
	meta: {
		key: "data-grid-showcase",
		version: "1.0.0",
		title: "Data Grid Showcase",
		description:
			"Focused ContractSpec table example covering client mode, server mode, and DataView adapter paths.",
		kind: "ui",
		visibility: "public",
		stability: "experimental",
		owners: ["@platform.core"],
		tags: ["table", "data-grid", "ui", "tanstack"],
		summary:
			"Reference implementation for the ContractSpec headless table stack.",
	},
	docs: {
		rootDocId: "docs.examples.data-grid-showcase",
		goalDocId: "docs.examples.data-grid-showcase.goal",
		usageDocId: "docs.examples.data-grid-showcase.usage",
	},
	entrypoints: {
		packageName: "@contractspec/example.data-grid-showcase",
		contracts: "./contracts",
		docs: "./docs",
		ui: "./ui",
	},
	surfaces: {
		templates: false,
		sandbox: {
			enabled: true,
			modes: ["playground", "specs", "markdown"],
		},
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
});

export default example;
