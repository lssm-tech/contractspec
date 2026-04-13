const fs = require('fs');
const path = require('path');

function readUiExports(packageJsonPath) {
	return Object.keys(
		JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).exports
	)
		.filter((key) => key.startsWith('./ui/'))
		.map((key) => key.slice(5))
		.sort();
}

function readConstArray(source, constName) {
	const file = fs.readFileSync(source, 'utf8');
	const match = file.match(
		new RegExp(`export const ${constName} = \\[(.*?)\\] as const;`, 's')
	);
	if (!match) {
		throw new Error(`Could not find ${constName} in ${source}`);
	}

	return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((entry) => entry[1]);
}

describe('ui inventory', () => {
	const root = path.resolve(__dirname, '..', '..');
	const uiKitPath = path.join(root, 'libs', 'ui-kit', 'package.json');
	const uiKitWebPath = path.join(root, 'libs', 'ui-kit-web', 'package.json');
	const registryPath = path.join(
		root,
		'libs',
		'ui-kit-core',
		'src',
		'interfaces',
		'registry.ts'
	);

	const nativeExports = readUiExports(uiKitPath);
	const webExports = readUiExports(uiKitWebPath);
	const sharedContracts = readConstArray(registryPath, 'sharedUiContractKeys');
	const sharedExclusions = new Set(
		readConstArray(registryPath, 'sharedUiContractExclusions')
	);

	it('keeps ui-kit-web aligned with the required shadcn component exports', () => {
		const required = [
			'button-group',
			'chart',
			'combobox',
			'direction',
			'item',
			'kbd',
			'native-select',
			'spinner',
		];

		expect(webExports).toEqual(expect.arrayContaining(required));
	});

	it('keeps ui-kit aligned with the required rn-primitives component exports', () => {
		const required = ['portal', 'slider', 'toast', 'toolbar'];
		expect(nativeExports).toEqual(expect.arrayContaining(required));
	});

	it('covers every shared ui export with a ui-kit-core contract key', () => {
		const overlap = webExports.filter(
			(key) => nativeExports.includes(key) && !sharedExclusions.has(key)
		);

		expect(sharedContracts.sort()).toEqual(overlap.sort());
	});
});
