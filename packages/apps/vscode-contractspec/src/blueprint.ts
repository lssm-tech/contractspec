import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const VscodeContractspecBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.vscode-contractspec',
			version: '1.0.0',
			title: 'Vscode Contractspec',
			description:
				'ContractSpec: spec-first development for AI-written software. Validate, scaffold, and explore your contract specifications.',
			domain: 'vscode-contractspec',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'vscode-contractspec'],
			stability: 'experimental',
		},
		appId: 'vscode-contractspec',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
