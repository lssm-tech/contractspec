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
	| '@contractspec/lib.design-system'
	| '@contractspec/lib.design-system/layout'
	| '@contractspec/lib.design-system/list'
	| '@contractspec/lib.design-system/typography';

type FixTarget = {
	component: string;
	importModule: ImportModule;
	explicitType?: 'ordered' | 'unordered' | 'none';
};

type FixOptions = {
	allowApps?: string[];
	filePath?: string;
};

type ImportCollection = {
	declarations: Set<string>;
	importDeclarations: ts.ImportDeclaration[];
	importedNames: Map<string, string>;
};

type ImportResolution =
	| {
			kind: 'compatible';
	  }
	| {
			kind: 'conflict';
			message: string;
	  }
	| {
			kind: 'needs-import';
	  };

type ListAttributeAnalysis = {
	classNameText: string | null;
	propsToInsert: string[];
	unsupportedReason?: string;
};

export type FixJsxPrimitivesResult = {
	changed: boolean;
	conflicts: string[];
	output: string;
	reports: string[];
	skipped: boolean;
	skippedRewrites: string[];
	unsupportedPatterns: string[];
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
	},
	h2: {
		component: 'H2',
		importModule: '@contractspec/lib.design-system/typography',
	},
	h3: {
		component: 'H3',
		importModule: '@contractspec/lib.design-system/typography',
	},
	h4: {
		component: 'H4',
		importModule: '@contractspec/lib.design-system/typography',
	},
	p: {
		component: 'P',
		importModule: '@contractspec/lib.design-system/typography',
	},
	ul: {
		component: 'List',
		importModule: '@contractspec/lib.design-system/list',
		explicitType: 'unordered',
	},
	ol: {
		component: 'List',
		importModule: '@contractspec/lib.design-system/list',
		explicitType: 'ordered',
	},
	li: {
		component: 'ListItem',
		importModule: '@contractspec/lib.design-system/list',
	},
};

const spacingTokenToProp = new Map<string, string>([
	['space-y-1', 'xs'],
	['space-y-2', 'sm'],
	['space-y-3', 'md'],
	['space-y-4', 'lg'],
]);

const listTokenToType = new Map<string, string>([
	['list-disc', 'unordered'],
	['list-decimal', 'ordered'],
	['list-none', 'none'],
]);

const listCompatibleModules = new Set([
	'@contractspec/lib.design-system',
	'@contractspec/lib.design-system/list',
	'@contractspec/lib.ui-kit-web/ui/list',
	'@contractspec/lib.ui-kit/ui/list',
]);

const typographyCompatibleModules = new Set([
	'@contractspec/lib.design-system',
	'@contractspec/lib.design-system/typography',
	'@contractspec/lib.ui-kit-web/ui/typography',
	'@contractspec/lib.ui-kit/ui/typography',
]);

const textCompatibleModules = new Set([
	'@contractspec/lib.design-system',
	'@contractspec/lib.design-system/typography',
	'@contractspec/lib.ui-kit-web/ui/text',
	'@contractspec/lib.ui-kit/ui/text',
]);

const boxCompatibleModules = new Set([
	'@contractspec/lib.design-system',
	'@contractspec/lib.design-system/layout',
	'@contractspec/lib.ui-kit-web/ui/stack',
	'@contractspec/lib.ui-kit/ui/stack',
]);

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

const blockSafeTextContainers = new Set([
	'Box',
	'ListItem',
	'P',
	'H1',
	'H2',
	'H3',
	'H4',
]);

function getJsxName(node: ts.JsxTagNameExpression): string | null {
	return ts.isIdentifier(node) ? node.text : null;
}

function getAttributeNameText(name: ts.JsxAttributeName): string | undefined {
	return ts.isIdentifier(name) ? name.text : undefined;
}

function getSimpleStringAttributeValue(
	attribute: ts.JsxAttribute
): string | undefined {
	return attribute.initializer && ts.isStringLiteral(attribute.initializer)
		? attribute.initializer.text
		: undefined;
}

function tokenizeClassName(value: string): string[] {
	return value
		.split(/\s+/)
		.map((token) => token.trim())
		.filter(Boolean);
}

function isVisibleJsxText(node: ts.Node): node is ts.JsxText {
	return ts.isJsxText(node) && node.getText().trim().length > 0;
}

function isWhitespaceOnlyJsxText(node: ts.Node): node is ts.JsxText {
	return ts.isJsxText(node) && node.getText().trim().length === 0;
}

function isStringLikeExpression(
	expression: ts.Expression
): expression is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral {
	return (
		ts.isStringLiteral(expression) ||
		ts.isNoSubstitutionTemplateLiteral(expression)
	);
}

function isWhitespaceOnlyExpression(node: ts.Node): boolean {
	return (
		ts.isJsxExpression(node) &&
		!!node.expression &&
		isStringLikeExpression(node.expression) &&
		node.expression.text.trim().length === 0
	);
}

function isTextCompatibleExpression(
	expression: ts.Expression | undefined
): boolean {
	if (!expression) {
		return false;
	}
	if (
		ts.isIdentifier(expression) ||
		ts.isPropertyAccessExpression(expression) ||
		ts.isElementAccessExpression(expression) ||
		ts.isNumericLiteral(expression) ||
		isStringLikeExpression(expression)
	) {
		return true;
	}
	if (ts.isParenthesizedExpression(expression)) {
		return isTextCompatibleExpression(expression.expression);
	}
	if (ts.isConditionalExpression(expression)) {
		return (
			isTextCompatibleExpression(expression.whenTrue) &&
			isTextCompatibleExpression(expression.whenFalse)
		);
	}
	if (ts.isTemplateExpression(expression)) {
		return expression.templateSpans.every((span) =>
			isTextCompatibleExpression(span.expression)
		);
	}
	if (
		ts.isBinaryExpression(expression) &&
		expression.operatorToken.kind === ts.SyntaxKind.PlusToken
	) {
		return (
			isTextCompatibleExpression(expression.left) &&
			isTextCompatibleExpression(expression.right)
		);
	}
	return false;
}

function isTextRunPart(node: ts.JsxChild): boolean {
	if (ts.isJsxText(node)) {
		return true;
	}
	return (
		ts.isJsxExpression(node) && isTextCompatibleExpression(node.expression)
	);
}

function hasVisibleText(node: ts.JsxChild): boolean {
	if (isVisibleJsxText(node)) {
		return true;
	}
	return (
		ts.isJsxExpression(node) &&
		!!node.expression &&
		(!isStringLikeExpression(node.expression) ||
			node.expression.text.trim().length > 0)
	);
}

function isMeaningfulJsxChild(node: ts.JsxChild): boolean {
	return !isWhitespaceOnlyJsxText(node) && !isWhitespaceOnlyExpression(node);
}

function determineTextWrapMode(
	effectiveContainer: string | null | undefined,
	children: readonly ts.JsxChild[],
	allowTextWrap: boolean
): 'none' | 'block' | 'inline' {
	if (!allowTextWrap) {
		return 'none';
	}

	const meaningfulChildren = children.filter(isMeaningfulJsxChild);
	if (meaningfulChildren.length === 0) {
		return 'none';
	}

	const hasNonTextSiblings = meaningfulChildren.some(
		(child) => !isTextRunPart(child)
	);

	if (
		effectiveContainer &&
		blockSafeTextContainers.has(effectiveContainer) &&
		!hasNonTextSiblings
	) {
		return 'block';
	}

	return 'inline';
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

function collectImportsAndDeclarations(
	sourceFile: ts.SourceFile
): ImportCollection {
	const declarations = new Set<string>();
	const importedNames = new Map<string, string>();
	const importDeclarations: ts.ImportDeclaration[] = [];

	function visit(node: ts.Node): void {
		if (
			ts.isImportDeclaration(node) &&
			ts.isStringLiteral(node.moduleSpecifier)
		) {
			importDeclarations.push(node);
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

	return { declarations, importDeclarations, importedNames };
}

function isCompatibleImport(
	name: string,
	importedFrom: string,
	targetModule: ImportModule
): boolean {
	if (importedFrom === targetModule) {
		return true;
	}
	if (targetModule === '@contractspec/lib.design-system/layout') {
		return name === 'Box' && boxCompatibleModules.has(importedFrom);
	}
	if (targetModule === '@contractspec/lib.design-system/list') {
		return (
			(name === 'List' || name === 'ListItem') &&
			listCompatibleModules.has(importedFrom)
		);
	}
	if (targetModule === '@contractspec/lib.design-system/typography') {
		if (name === 'Text') {
			return textCompatibleModules.has(importedFrom);
		}
		return typographyCompatibleModules.has(importedFrom);
	}
	return false;
}

function resolveImport(
	name: string,
	targetModule: ImportModule,
	importCollection: ImportCollection
): ImportResolution {
	const importedFrom = importCollection.importedNames.get(name);
	if (importedFrom) {
		return isCompatibleImport(name, importedFrom, targetModule)
			? { kind: 'compatible' }
			: {
					kind: 'conflict',
					message: `${name} is already imported from ${importedFrom}.`,
				};
	}
	if (importCollection.declarations.has(name)) {
		return {
			kind: 'conflict',
			message: `${name} is already declared locally.`,
		};
	}
	return { kind: 'needs-import' };
}

function addRequiredImport(
	requiredImports: Map<ImportModule, Set<string>>,
	importCollection: ImportCollection,
	target: FixTarget,
	conflicts: Set<string>
): boolean {
	const resolution = resolveImport(
		target.component,
		target.importModule,
		importCollection
	);
	if (resolution.kind === 'conflict') {
		conflicts.add(resolution.message);
		return false;
	}
	if (resolution.kind === 'needs-import') {
		const names = requiredImports.get(target.importModule) ?? new Set<string>();
		names.add(target.component);
		requiredImports.set(target.importModule, names);
	}
	return true;
}

function analyzeListClassName(
	value: string,
	defaultType: string | undefined
): ListAttributeAnalysis {
	const tokens = tokenizeClassName(value);
	const residualTokens: string[] = [];
	let inferredType = defaultType;
	let inferredSpacing: string | undefined;
	let sawListTypeToken = false;
	let sawSpacingToken = false;

	for (const token of tokens) {
		const mappedType = listTokenToType.get(token);
		if (mappedType) {
			inferredType = mappedType;
			sawListTypeToken = true;
			continue;
		}

		const mappedSpacing = spacingTokenToProp.get(token);
		if (mappedSpacing) {
			inferredSpacing = mappedSpacing;
			sawSpacingToken = true;
			continue;
		}

		residualTokens.push(token);
	}

	const propsToInsert: string[] = [];
	if (defaultType === 'ordered' || sawListTypeToken) {
		propsToInsert.push(`type="${inferredType ?? defaultType}"`);
	} else if (inferredType && inferredType !== 'unordered') {
		propsToInsert.push(`type="${inferredType}"`);
	}

	if (sawSpacingToken && inferredSpacing) {
		propsToInsert.push(`spacing="${inferredSpacing}"`);
	}

	return {
		classNameText: residualTokens.length > 0 ? residualTokens.join(' ') : null,
		propsToInsert,
	};
}

function preserveClassnameAndAttributes(
	node: ts.JsxOpeningElement | ts.JsxSelfClosingElement,
	target: FixTarget,
	sourceFile: ts.SourceFile
): {
	attributeText: string;
	unsupportedReason?: string;
} {
	const attributeTexts: string[] = [];
	let inferredProps: string[] = [];

	for (const property of node.attributes.properties) {
		if (ts.isJsxSpreadAttribute(property)) {
			attributeTexts.push(property.getText(sourceFile));
			continue;
		}

		const attributeName = getAttributeNameText(property.name);
		if (!attributeName) {
			attributeTexts.push(property.getText(sourceFile));
			continue;
		}

		if (
			target.component === 'List' &&
			attributeName === 'type' &&
			property.initializer
		) {
			return {
				attributeText: '',
				unsupportedReason:
					'Raw list `type` attributes are not auto-fixable because they do not map cleanly to design-system List props.',
			};
		}

		if (attributeName === 'className' && target.component === 'List') {
			const classValue = getSimpleStringAttributeValue(property);
			if (classValue !== undefined) {
				const analysis = analyzeListClassName(classValue, target.explicitType);
				inferredProps = analysis.propsToInsert;
				if (analysis.classNameText) {
					attributeTexts.push(`className="${analysis.classNameText}"`);
				}
				continue;
			}
		}

		attributeTexts.push(property.getText(sourceFile));
	}

	const allAttributes = [...inferredProps, ...attributeTexts];
	return {
		attributeText:
			allAttributes.length > 0 ? ` ${allAttributes.join(' ')}` : '',
	};
}

function classifyElementRewrite(
	node: ts.JsxOpeningElement | ts.JsxSelfClosingElement | ts.JsxClosingElement,
	sourceFile: ts.SourceFile
): {
	replacement?: Replacement;
	target?: FixTarget;
	unsupportedReason?: string;
} {
	const name = getJsxName(node.tagName);
	if (!name) {
		return {};
	}

	if (name === 'span') {
		return {
			unsupportedReason:
				'Generic <span> autofix is intentionally skipped until there is an inline-safe design-system text strategy.',
		};
	}

	const target = intrinsicTargets[name];
	if (!target) {
		return {};
	}

	if (ts.isJsxClosingElement(node)) {
		return {
			replacement: {
				start: node.tagName.getStart(sourceFile),
				end: node.tagName.getEnd(),
				text: target.component,
			},
			target,
		};
	}

	const preserved = preserveClassnameAndAttributes(node, target, sourceFile);
	if (preserved.unsupportedReason) {
		return {
			target,
			unsupportedReason: preserved.unsupportedReason,
		};
	}

	return {
		replacement: {
			start: node.getStart(sourceFile),
			end: node.getEnd(),
			text: ts.isJsxSelfClosingElement(node)
				? `<${target.component}${preserved.attributeText} />`
				: `<${target.component}${preserved.attributeText}>`,
		},
		target,
	};
}

function collectTextRunReplacements(
	children: readonly ts.JsxChild[],
	sourceFile: ts.SourceFile,
	mode: 'none' | 'block' | 'inline'
): Replacement[] {
	if (mode === 'none') {
		return [];
	}

	const replacements: Replacement[] = [];
	let index = 0;

	while (index < children.length) {
		const child = children[index];
		if (!child || !isTextRunPart(child)) {
			index++;
			continue;
		}

		const run: ts.JsxChild[] = [child];
		let nextIndex = index + 1;
		while (
			nextIndex < children.length &&
			children[nextIndex] &&
			isTextRunPart(children[nextIndex]!)
		) {
			run.push(children[nextIndex]!);
			nextIndex++;
		}

		if (run.some(hasVisibleText)) {
			const first = run[0];
			const last = run[run.length - 1];
			if (first && last) {
				const sourceSlice = sourceFile.text.slice(
					first.getStart(sourceFile),
					last.getEnd()
				);
				replacements.push({
					start: first.getStart(sourceFile),
					end: last.getEnd(),
					text:
						mode === 'inline'
							? `<Text asChild><span>${sourceSlice}</span></Text>`
							: `<Text>${sourceSlice}</Text>`,
				});
			}
		}

		index = nextIndex;
	}

	return replacements;
}

function mergeAndInsertImports(
	source: string,
	requiredImports: Map<ImportModule, Set<string>>
): string {
	if (requiredImports.size === 0) {
		return source;
	}

	let output = source;

	for (const importModule of [...requiredImports.keys()].sort()) {
		const names = [
			...(requiredImports.get(importModule) ?? new Set<string>()),
		].sort();
		if (names.length === 0) {
			continue;
		}

		const sourceFile = ts.createSourceFile(
			'updated.tsx',
			output,
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TSX
		);
		const importCollection = collectImportsAndDeclarations(sourceFile);
		const importDeclaration = importCollection.importDeclarations.find(
			(statement) =>
				ts.isStringLiteral(statement.moduleSpecifier) &&
				statement.moduleSpecifier.text === importModule
		);

		if (
			importDeclaration?.importClause?.namedBindings &&
			ts.isNamedImports(importDeclaration.importClause.namedBindings)
		) {
			const existingNames =
				importDeclaration.importClause.namedBindings.elements.map((element) =>
					element.getText(sourceFile)
				);
			const merged = [...new Set([...existingNames, ...names])].sort();
			const replacement = `import { ${merged.join(', ')} } from '${importModule}';`;
			output = applyReplacements(output, [
				{
					start: importDeclaration.getStart(sourceFile),
					end: importDeclaration.getEnd(),
					text: replacement,
				},
			]);
			continue;
		}

		const importText = `import { ${names.join(', ')} } from '${importModule}';\n`;
		const insertAt =
			importCollection.importDeclarations.length > 0
				? (importCollection.importDeclarations[
						importCollection.importDeclarations.length - 1
					]?.end ?? 0)
				: 0;
		const prefix = insertAt > 0 ? '\n' : '';
		output = `${output.slice(0, insertAt)}${prefix}${importText}${output.slice(insertAt)}`;
	}

	return output;
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
			skippedRewrites: [],
			unsupportedPatterns: [],
		};
	}

	const sourceFile = ts.createSourceFile(
		options.filePath ?? 'fixture.tsx',
		source,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX
	);
	const importCollection = collectImportsAndDeclarations(sourceFile);
	const replacements: Replacement[] = [];
	const requiredImports = new Map<ImportModule, Set<string>>();
	const conflicts = new Set<string>();
	const reports: string[] = [];
	const skippedRewrites = new Set<string>();
	const unsupportedPatterns = new Set<string>();

	function maybeRequireImport(target: FixTarget): boolean {
		return addRequiredImport(
			requiredImports,
			importCollection,
			target,
			conflicts
		);
	}

	function visit(node: ts.Node, allowTextWrap = true): void {
		if (ts.isJsxSelfClosingElement(node)) {
			const classified = classifyElementRewrite(node, sourceFile);
			if (classified.unsupportedReason) {
				const name = getJsxName(node.tagName);
				if (name === 'span') {
					unsupportedPatterns.add(classified.unsupportedReason);
				} else {
					skippedRewrites.add(classified.unsupportedReason);
				}
			}
			if (
				classified.replacement &&
				classified.target &&
				maybeRequireImport(classified.target)
			) {
				replacements.push(classified.replacement);
			}
			return;
		}

		if (ts.isJsxElement(node)) {
			const openingName = getJsxName(node.openingElement.tagName);
			const target = openingName ? intrinsicTargets[openingName] : undefined;
			const openingClassification = classifyElementRewrite(
				node.openingElement,
				sourceFile
			);
			let rewriteApplied = false;
			let rewriteBlocked = false;

			if (openingClassification.unsupportedReason) {
				if (openingName === 'span') {
					unsupportedPatterns.add(openingClassification.unsupportedReason);
				} else {
					skippedRewrites.add(openingClassification.unsupportedReason);
				}
				rewriteBlocked = true;
			}

			if (openingClassification.replacement && openingClassification.target) {
				if (maybeRequireImport(openingClassification.target)) {
					replacements.push(openingClassification.replacement);
					const closingClassification = classifyElementRewrite(
						node.closingElement,
						sourceFile
					);
					if (closingClassification.replacement) {
						replacements.push(closingClassification.replacement);
					}
					rewriteApplied = true;
				} else if (target) {
					rewriteBlocked = true;
				}
			}

			const effectiveContainer = rewriteApplied
				? openingClassification.target?.component
				: openingName;
			const currentAllowTextWrap =
				allowTextWrap &&
				!rewriteBlocked &&
				!(effectiveContainer && typographyContainers.has(effectiveContainer));

			const textWrapMode = determineTextWrapMode(
				effectiveContainer,
				node.children,
				currentAllowTextWrap
			);

			if (textWrapMode !== 'none') {
				const textImportTarget: FixTarget = {
					component: 'Text',
					importModule: '@contractspec/lib.design-system/typography',
				};
				const textImportResolution = resolveImport(
					textImportTarget.component,
					textImportTarget.importModule,
					importCollection
				);

				if (textImportResolution.kind === 'conflict') {
					conflicts.add(textImportResolution.message);
				} else {
					if (textImportResolution.kind === 'needs-import') {
						const names =
							requiredImports.get(textImportTarget.importModule) ??
							new Set<string>();
						names.add(textImportTarget.component);
						requiredImports.set(textImportTarget.importModule, names);
					}
					replacements.push(
						...collectTextRunReplacements(
							node.children,
							sourceFile,
							textWrapMode
						)
					);
				}
			}

			for (const child of node.children) {
				visit(child, currentAllowTextWrap);
			}
			return;
		}

		if (ts.isJsxFragment(node)) {
			const textWrapMode = determineTextWrapMode(
				null,
				node.children,
				allowTextWrap
			);
			if (textWrapMode !== 'none') {
				const textImportTarget: FixTarget = {
					component: 'Text',
					importModule: '@contractspec/lib.design-system/typography',
				};
				const textImportResolution = resolveImport(
					textImportTarget.component,
					textImportTarget.importModule,
					importCollection
				);

				if (textImportResolution.kind === 'conflict') {
					conflicts.add(textImportResolution.message);
				} else {
					if (textImportResolution.kind === 'needs-import') {
						const names =
							requiredImports.get(textImportTarget.importModule) ??
							new Set<string>();
						names.add(textImportTarget.component);
						requiredImports.set(textImportTarget.importModule, names);
					}
					replacements.push(
						...collectTextRunReplacements(
							node.children,
							sourceFile,
							textWrapMode
						)
					);
				}
			}

			for (const child of node.children) {
				visit(child, allowTextWrap);
			}
			return;
		}

		ts.forEachChild(node, (child) => visit(child, allowTextWrap));
	}

	visit(sourceFile);

	if (conflicts.size > 0 && replacements.length === 0) {
		return {
			changed: false,
			conflicts: [...conflicts].sort(),
			output: source,
			reports,
			skipped: true,
			skippedRewrites: [...skippedRewrites].sort(),
			unsupportedPatterns: [...unsupportedPatterns].sort(),
		};
	}

	let output =
		replacements.length > 0 ? applyReplacements(source, replacements) : source;
	output = mergeAndInsertImports(output, requiredImports);

	return {
		changed: output !== source,
		conflicts: [...conflicts].sort(),
		output,
		reports,
		skipped: false,
		skippedRewrites: [...skippedRewrites].sort(),
		unsupportedPatterns: [...unsupportedPatterns].sort(),
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
	const skippedMessages: string[] = [];
	const unsupportedMessages: string[] = [];

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
		for (const skippedRewrite of result.skippedRewrites) {
			skippedMessages.push(`${displayPath}: ${skippedRewrite}`);
		}
		for (const unsupportedPattern of result.unsupportedPatterns) {
			unsupportedMessages.push(`${displayPath}: ${unsupportedPattern}`);
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
	for (const message of skippedMessages) {
		console.log(message);
	}
	for (const message of unsupportedMessages) {
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
