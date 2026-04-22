import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ts from 'typescript';

type FixMode = 'check' | 'write';

type Replacement = {
	start: number;
	end: number;
	text: string;
};

type ImportModule =
	| '@contractspec/lib.design-system/layout'
	| '@contractspec/lib.design-system/list'
	| '@contractspec/lib.design-system/typography';

type FixTarget = {
	component: string;
	importModule: ImportModule;
	ordered?: boolean;
	typography?: boolean;
};

type FixOptions = {
	allowApps?: string[];
	filePath?: string;
};

export type FixJsxPrimitivesResult = {
	changed: boolean;
	conflicts: string[];
	output: string;
	reports: string[];
	skipped: boolean;
};

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageRoot, '..', '..', '..');

const intrinsicTargets: Record<string, FixTarget> = {
	div: {
		component: 'Box',
		importModule: '@contractspec/lib.design-system/layout',
	},
	section: {
		component: 'Box',
		importModule: '@contractspec/lib.design-system/layout',
	},
	main: {
		component: 'Box',
		importModule: '@contractspec/lib.design-system/layout',
	},
	header: {
		component: 'Box',
		importModule: '@contractspec/lib.design-system/layout',
	},
	footer: {
		component: 'Box',
		importModule: '@contractspec/lib.design-system/layout',
	},
	nav: {
		component: 'Box',
		importModule: '@contractspec/lib.design-system/layout',
	},
	h1: {
		component: 'H1',
		importModule: '@contractspec/lib.design-system/typography',
		typography: true,
	},
	h2: {
		component: 'H2',
		importModule: '@contractspec/lib.design-system/typography',
		typography: true,
	},
	h3: {
		component: 'H3',
		importModule: '@contractspec/lib.design-system/typography',
		typography: true,
	},
	h4: {
		component: 'H4',
		importModule: '@contractspec/lib.design-system/typography',
		typography: true,
	},
	p: {
		component: 'P',
		importModule: '@contractspec/lib.design-system/typography',
		typography: true,
	},
	span: {
		component: 'Text',
		importModule: '@contractspec/lib.design-system/typography',
		typography: true,
	},
	ul: {
		component: 'List',
		importModule: '@contractspec/lib.design-system/list',
	},
	ol: {
		component: 'List',
		importModule: '@contractspec/lib.design-system/list',
		ordered: true,
	},
	li: {
		component: 'ListItem',
		importModule: '@contractspec/lib.design-system/list',
	},
};

const typographyContainers = new Set([
	'Text',
	'H1',
	'H2',
	'H3',
	'H4',
	'P',
	'Lead',
	'Large',
	'Small',
	'Muted',
	'Code',
	'BlockQuote',
	'LegalText',
	'LegalHeading',
]);

function getJsxName(node: ts.JsxTagNameExpression): string | null {
	if (ts.isIdentifier(node)) {
		return node.text;
	}
	return null;
}

function isVisibleText(node: ts.Node): node is ts.JsxText {
	return ts.isJsxText(node) && node.getText().trim().length > 0;
}

function isIgnorableJsxChild(node: ts.Node): boolean {
	return ts.isJsxText(node) && node.getText().trim().length === 0;
}

function applyReplacements(
	source: string,
	replacements: Replacement[]
): string {
	return [...replacements]
		.sort((a, b) => b.start - a.start)
		.reduce(
			(nextSource, replacement) =>
				`${nextSource.slice(0, replacement.start)}${replacement.text}${nextSource.slice(replacement.end)}`,
			source
		);
}

function addTargetImport(
	sourceFile: ts.SourceFile,
	source: string,
	importModule: ImportModule,
	names: string[]
): string {
	if (names.length === 0) {
		return source;
	}

	const sortedNames = [...new Set(names)].sort();
	const importText = `import { ${sortedNames.join(', ')} } from '${importModule}';\n`;
	const importDeclarations = sourceFile.statements.filter(
		ts.isImportDeclaration
	);
	const insertAt =
		importDeclarations.length > 0
			? (importDeclarations[importDeclarations.length - 1]?.end ?? 0)
			: 0;
	const prefix =
		insertAt > 0 && !source.slice(insertAt).startsWith('\n') ? '\n' : '';

	return `${source.slice(0, insertAt)}${prefix}${importText}${source.slice(insertAt)}`;
}

function collectImportsAndDeclarations(sourceFile: ts.SourceFile): {
	declarations: Set<string>;
	importedNames: Map<string, string>;
} {
	const declarations = new Set<string>();
	const importedNames = new Map<string, string>();

	function visit(node: ts.Node): void {
		if (
			ts.isImportDeclaration(node) &&
			ts.isStringLiteral(node.moduleSpecifier)
		) {
			const moduleName = node.moduleSpecifier.text;
			const bindings = node.importClause?.namedBindings;
			if (bindings && ts.isNamedImports(bindings)) {
				for (const element of bindings.elements) {
					importedNames.set(element.name.text, moduleName);
				}
			}
			if (node.importClause?.name) {
				importedNames.set(node.importClause.name.text, moduleName);
			}
			return;
		}

		if (
			(ts.isVariableDeclaration(node) ||
				ts.isFunctionDeclaration(node) ||
				ts.isClassDeclaration(node) ||
				ts.isInterfaceDeclaration(node) ||
				ts.isTypeAliasDeclaration(node) ||
				ts.isEnumDeclaration(node)) &&
			node.name &&
			ts.isIdentifier(node.name)
		) {
			declarations.add(node.name.text);
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);

	return { declarations, importedNames };
}

function shouldProcessFile(
	filePath: string | undefined,
	allowApps: string[]
): boolean {
	if (!filePath) {
		return true;
	}

	const normalized = filePath.split('\\').join('/');
	const match = normalized.match(/(?:^|\/)packages\/apps\/([^/]+)\//);
	return !match || allowApps.includes(match[1] ?? '');
}

export function fixJsxPrimitivesInSource(
	source: string,
	options: FixOptions = {}
): FixJsxPrimitivesResult {
	const allowApps = options.allowApps ?? [];
	if (!shouldProcessFile(options.filePath, allowApps)) {
		return {
			changed: false,
			conflicts: [],
			output: source,
			reports: ['Skipped app package outside appPackageAllowList.'],
			skipped: true,
		};
	}

	const sourceFile = ts.createSourceFile(
		options.filePath ?? 'fixture.tsx',
		source,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX
	);
	const { declarations, importedNames } =
		collectImportsAndDeclarations(sourceFile);
	const replacements: Replacement[] = [];
	const requiredImports = new Map<ImportModule, Set<string>>();
	const reports: string[] = [];

	function requireImport(target: FixTarget): void {
		const names = requiredImports.get(target.importModule) ?? new Set<string>();
		names.add(target.component);
		requiredImports.set(target.importModule, names);
	}

	function visit(node: ts.Node): void {
		if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
			const name = getJsxName(node.tagName);
			const target = name ? intrinsicTargets[name] : undefined;
			if (target) {
				replacements.push({
					start: node.tagName.getStart(sourceFile),
					end: node.tagName.getEnd(),
					text: target.component,
				});
				if (target.ordered && ts.isJsxOpeningElement(node)) {
					const hasTypeAttribute = node.attributes.properties.some(
						(attribute) =>
							ts.isJsxAttribute(attribute) &&
							ts.isIdentifier(attribute.name) &&
							attribute.name.text === 'type'
					);
					if (!hasTypeAttribute) {
						replacements.push({
							start: node.tagName.getEnd(),
							end: node.tagName.getEnd(),
							text: ' type="ordered"',
						});
					}
				}
				requireImport(target);
			}
		}

		if (ts.isJsxClosingElement(node)) {
			const name = getJsxName(node.tagName);
			const target = name ? intrinsicTargets[name] : undefined;
			if (target) {
				replacements.push({
					start: node.tagName.getStart(sourceFile),
					end: node.tagName.getEnd(),
					text: target.component,
				});
			}
		}

		if (ts.isJsxElement(node)) {
			const openingName = getJsxName(node.openingElement.tagName);
			const target = openingName ? intrinsicTargets[openingName] : undefined;
			const effectiveContainer = target?.component ?? openingName;
			const isTypographyContainer = effectiveContainer
				? typographyContainers.has(effectiveContainer)
				: false;
			const visibleChildren = node.children.filter(
				(child) => !isIgnorableJsxChild(child)
			);
			const visibleTextChildren = node.children.filter(isVisibleText);

			if (!isTypographyContainer && visibleTextChildren.length > 0) {
				const onlyVisibleChild = visibleChildren[0];
				if (
					visibleChildren.length === 1 &&
					onlyVisibleChild &&
					isVisibleText(onlyVisibleChild)
				) {
					const child = onlyVisibleChild;
					replacements.push({
						start: child.getStart(sourceFile),
						end: child.getEnd(),
						text: `<Text>${child.getText()}</Text>`,
					});
					requiredImports.set(
						'@contractspec/lib.design-system/typography',
						(
							requiredImports.get(
								'@contractspec/lib.design-system/typography'
							) ?? new Set<string>()
						).add('Text')
					);
				} else {
					reports.push(
						`Mixed JSX text left unchanged at ${sourceFile.getLineAndCharacterOfPosition(visibleTextChildren[0]?.getStart(sourceFile) ?? node.getStart(sourceFile)).line + 1}.`
					);
				}
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);

	if (replacements.length === 0) {
		return {
			changed: false,
			conflicts: [],
			output: source,
			reports,
			skipped: false,
		};
	}

	const conflicts: string[] = [];
	for (const [importModule, names] of requiredImports) {
		for (const name of names) {
			const importedFrom = importedNames.get(name);
			if (importedFrom && importedFrom !== importModule) {
				conflicts.push(`${name} is already imported from ${importedFrom}.`);
			}
			if (!importedFrom && declarations.has(name)) {
				conflicts.push(`${name} is already declared locally.`);
			}
		}
	}

	if (conflicts.length > 0) {
		return {
			changed: false,
			conflicts,
			output: source,
			reports,
			skipped: true,
		};
	}

	let output = applyReplacements(source, replacements);
	for (const [importModule, names] of requiredImports) {
		const missingNames = [...names].filter(
			(name) => importedNames.get(name) !== importModule
		);
		output = addTargetImport(sourceFile, output, importModule, missingNames);
	}

	return {
		changed: output !== source,
		conflicts: [],
		output,
		reports,
		skipped: false,
	};
}

async function collectFiles(paths: string[]): Promise<string[]> {
	const files: string[] = [];

	async function visit(path: string): Promise<void> {
		const entries = await readdir(path, { withFileTypes: true }).catch(
			() => null
		);
		if (!entries) {
			if (/\.[jt]sx$/.test(path)) {
				files.push(path);
			}
			return;
		}

		for (const entry of entries) {
			if (
				entry.name === 'node_modules' ||
				entry.name === 'dist' ||
				entry.name === 'build' ||
				entry.name === 'generated'
			) {
				continue;
			}
			const childPath = resolve(path, entry.name);
			if (entry.isDirectory()) {
				await visit(childPath);
			} else if (/\.[jt]sx$/.test(entry.name)) {
				files.push(childPath);
			}
		}
	}

	for (const path of paths) {
		await visit(path);
	}

	return files.sort();
}

type CliOptions = {
	allowApps: string[];
	mode: FixMode;
	paths: string[];
};

function parseArgs(args: string[]): CliOptions {
	const allowApps: string[] = [];
	const paths: string[] = [];
	let mode: FixMode = 'check';

	for (let index = 0; index < args.length; index++) {
		const arg = args[index];
		if (arg === '--write') {
			mode = 'write';
			continue;
		}
		if (arg === '--check') {
			mode = 'check';
			continue;
		}
		if (arg === '--allow-app') {
			const appName = args[index + 1];
			if (!appName) {
				throw new Error('--allow-app requires an app package name.');
			}
			allowApps.push(appName);
			index++;
			continue;
		}
		if (arg?.startsWith('--allow-app=')) {
			allowApps.push(arg.slice('--allow-app='.length));
			continue;
		}
		if (arg) {
			paths.push(resolve(process.cwd(), arg));
		}
	}

	return {
		allowApps,
		mode,
		paths:
			paths.length > 0
				? paths
				: [
						resolve(repoRoot, 'packages/bundles'),
						resolve(repoRoot, 'packages/examples'),
						resolve(repoRoot, 'packages/modules'),
					],
	};
}

export async function runFixJsxPrimitivesCli(args: string[]): Promise<number> {
	const options = parseArgs(args);
	const files = await collectFiles(options.paths);
	const changedFiles: string[] = [];
	const conflictMessages: string[] = [];
	const reportMessages: string[] = [];

	for (const filePath of files) {
		const source = await readFile(filePath, 'utf8');
		const result = fixJsxPrimitivesInSource(source, {
			allowApps: options.allowApps,
			filePath,
		});
		const displayPath = relative(process.cwd(), filePath);

		for (const conflict of result.conflicts) {
			conflictMessages.push(`${displayPath}: ${conflict}`);
		}
		for (const report of result.reports) {
			reportMessages.push(`${displayPath}: ${report}`);
		}
		if (result.changed) {
			changedFiles.push(displayPath);
			if (options.mode === 'write') {
				await writeFile(filePath, result.output, 'utf8');
			}
		}
	}

	for (const message of reportMessages) {
		console.log(message);
	}
	for (const message of conflictMessages) {
		console.error(message);
	}

	if (changedFiles.length > 0) {
		const verb = options.mode === 'write' ? 'Updated' : 'Would update';
		console.log(`${verb} ${changedFiles.length} file(s):`);
		for (const file of changedFiles) {
			console.log(`- ${file}`);
		}
	}

	if (conflictMessages.length > 0) {
		return 2;
	}
	return 0;
}

if (
	process.argv[1] &&
	resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	runFixJsxPrimitivesCli(process.argv.slice(2))
		.then((code) => {
			process.exitCode = code;
		})
		.catch((error) => {
			console.error(error instanceof Error ? error.message : String(error));
			process.exitCode = 2;
		});
}
