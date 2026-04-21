import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import type { DocBlockManifestEntry, PackageDocManifest } from './manifest';
import type { DocBlock } from './types';

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

type ModuleAnalysis = {
	entries: DocBlockManifestEntry[];
	docRefs: string[];
};

function isDocBlockValue(value: unknown): value is DocBlock {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	return (
		typeof candidate.id === 'string' &&
		typeof candidate.title === 'string' &&
		typeof candidate.body === 'string'
	);
}

function evaluateExpression(
	expression: ts.Expression,
	locals: Map<string, JsonValue>,
	_filePath: string
): JsonValue | undefined {
	if (ts.isParenthesizedExpression(expression)) {
		return evaluateExpression(expression.expression, locals, _filePath);
	}

	if (ts.isSatisfiesExpression(expression) || ts.isAsExpression(expression)) {
		return evaluateExpression(expression.expression, locals, _filePath);
	}

	if (
		ts.isStringLiteral(expression) ||
		ts.isNoSubstitutionTemplateLiteral(expression)
	) {
		return expression.text;
	}

	if (ts.isNumericLiteral(expression)) {
		return Number(expression.text);
	}

	if (expression.kind === ts.SyntaxKind.TrueKeyword) {
		return true;
	}

	if (expression.kind === ts.SyntaxKind.FalseKeyword) {
		return false;
	}

	if (expression.kind === ts.SyntaxKind.NullKeyword) {
		return null;
	}

	if (ts.isArrayLiteralExpression(expression)) {
		const values: JsonValue[] = [];
		for (const element of expression.elements) {
			const value = evaluateExpression(
				element as ts.Expression,
				locals,
				_filePath
			);
			if (value === undefined) {
				return undefined;
			}
			values.push(value);
		}
		return values;
	}

	if (ts.isObjectLiteralExpression(expression)) {
		const value: Record<string, JsonValue> = {};

		for (const property of expression.properties) {
			if (!ts.isPropertyAssignment(property)) {
				return undefined;
			}

			const name = property.name.getText().replace(/^["']|["']$/g, '');
			const propertyValue = evaluateExpression(
				property.initializer,
				locals,
				_filePath
			);
			if (propertyValue === undefined) {
				return undefined;
			}
			value[name] = propertyValue;
		}

		return value;
	}

	if (ts.isIdentifier(expression)) {
		return locals.get(expression.text);
	}

	if (ts.isPropertyAccessExpression(expression)) {
		const parent = evaluateExpression(expression.expression, locals, _filePath);
		if (!parent || typeof parent !== 'object' || Array.isArray(parent)) {
			return undefined;
		}

		return parent[expression.name.text];
	}

	if (
		ts.isCallExpression(expression) &&
		ts.isIdentifier(expression.expression)
	) {
		if (
			(expression.expression.text === 'docId' ||
				expression.expression.text === 'docRef') &&
			expression.arguments.length === 1
		) {
			return evaluateExpression(expression.arguments[0]!, locals, _filePath);
		}
	}

	return undefined;
}

function collectLocalValues(
	sourceFile: ts.SourceFile,
	filePath: string
): Map<string, JsonValue> {
	const locals = new Map<string, JsonValue>();

	for (const statement of sourceFile.statements) {
		if (!ts.isVariableStatement(statement)) {
			continue;
		}

		for (const declaration of statement.declarationList.declarations) {
			if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
				continue;
			}

			let value: JsonValue | undefined;
			try {
				value = evaluateExpression(declaration.initializer, locals, filePath);
			} catch {
				value = undefined;
			}
			if (value !== undefined) {
				locals.set(declaration.name.text, value);
			}
		}
	}

	return locals;
}

function extractDocRefsFromExpression(
	expression: ts.Expression,
	locals: Map<string, JsonValue>,
	filePath: string
): string[] {
	let candidate = expression;
	while (
		ts.isParenthesizedExpression(candidate) ||
		ts.isSatisfiesExpression(candidate) ||
		ts.isAsExpression(candidate)
	) {
		candidate = candidate.expression;
	}

	if (!ts.isObjectLiteralExpression(candidate)) {
		return [];
	}

	const metaProperty = candidate.properties.find(
		(property) =>
			ts.isPropertyAssignment(property) && property.name.getText() === 'meta'
	);
	if (!metaProperty || !ts.isPropertyAssignment(metaProperty)) {
		return [];
	}

	let metaInitializer: ts.Expression = metaProperty.initializer;
	while (
		ts.isParenthesizedExpression(metaInitializer) ||
		ts.isSatisfiesExpression(metaInitializer) ||
		ts.isAsExpression(metaInitializer)
	) {
		metaInitializer = metaInitializer.expression;
	}

	if (!ts.isObjectLiteralExpression(metaInitializer)) {
		return [];
	}

	const docIdProperty = metaInitializer.properties.find(
		(property) =>
			ts.isPropertyAssignment(property) && property.name.getText() === 'docId'
	);
	if (!docIdProperty || !ts.isPropertyAssignment(docIdProperty)) {
		return [];
	}

	const refs = evaluateExpression(docIdProperty.initializer, locals, filePath);
	if (
		!Array.isArray(refs) ||
		!refs.every((entry) => typeof entry === 'string')
	) {
		throw new Error(
			`Non-static DocBlock reference in ${filePath} at ${docIdProperty.initializer.getStart()}`
		);
	}

	return refs;
}

export function extractModuleDocData(
	sourceText: string,
	filePath: string,
	sourceModule: string
): ModuleAnalysis {
	const sourceFile = ts.createSourceFile(
		filePath,
		sourceText,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	);
	const locals = collectLocalValues(sourceFile, filePath);
	const entries: DocBlockManifestEntry[] = [];
	const docRefs = new Set<string>();

	for (const statement of sourceFile.statements) {
		if (!ts.isVariableStatement(statement)) {
			continue;
		}

		const isExported = statement.modifiers?.some(
			(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
		);
		if (!isExported) {
			continue;
		}

		for (const declaration of statement.declarationList.declarations) {
			if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
				continue;
			}

			const value = evaluateExpression(
				declaration.initializer,
				locals,
				filePath
			);
			for (const ref of extractDocRefsFromExpression(
				declaration.initializer,
				locals,
				filePath
			)) {
				docRefs.add(ref);
			}

			if (value === undefined) {
				if (
					declaration.name.text.includes('DocBlock') ||
					declaration.initializer
						.getText(sourceFile)
						.includes('satisfies DocBlock')
				) {
					throw new Error(
						`Non-static DocBlock source in ${filePath} at ${declaration.initializer.getStart(sourceFile)}`
					);
				}
				continue;
			}

			if (isDocBlockValue(value)) {
				entries.push({
					id: value.id,
					exportName: declaration.name.text,
					sourceModule,
					block: value,
				});
			}

			if (
				Array.isArray(value) &&
				value.every((entry) => isDocBlockValue(entry))
			) {
				for (const block of value) {
					entries.push({
						id: block.id,
						exportName: declaration.name.text,
						sourceModule,
						block,
					});
				}
			}
		}
	}

	return { entries, docRefs: [...docRefs] };
}

function shouldIgnoreSourceFile(filePath: string): boolean {
	return (
		!filePath.endsWith('.ts') ||
		filePath.endsWith('.test.ts') ||
		filePath.endsWith('.generated.ts') ||
		filePath.includes(`${path.sep}dist${path.sep}`)
	);
}

function listSourceFiles(srcRoot: string): string[] {
	return fs
		.readdirSync(srcRoot, { withFileTypes: true })
		.flatMap((entry) => {
			const absPath = path.join(srcRoot, entry.name);
			if (entry.isDirectory()) {
				return listSourceFiles(absPath);
			}
			return shouldIgnoreSourceFile(absPath) ? [] : [absPath];
		})
		.sort((left, right) => left.localeCompare(right));
}

function toSourceModule(srcRoot: string, filePath: string): string {
	return path
		.relative(srcRoot, filePath)
		.replace(/\\/g, '/')
		.replace(/\.ts$/, '');
}

export function buildPackageDocManifest(options: {
	packageName: string;
	srcRoot: string;
	generatedAt?: string;
}): PackageDocManifest {
	const {
		packageName,
		srcRoot,
		generatedAt = new Date().toISOString(),
	} = options;
	const allSourceFiles = listSourceFiles(srcRoot);

	for (const filePath of allSourceFiles) {
		if (filePath.endsWith('.docblock.ts')) {
			throw new Error(
				`Standalone DocBlock sources are not allowed: ${filePath}`
			);
		}

		if (filePath.includes(`${path.sep}docs${path.sep}tech${path.sep}`)) {
			throw new Error(`docs/tech source files are not allowed: ${filePath}`);
		}
	}

	const entries: DocBlockManifestEntry[] = [];
	const seenIds = new Map<string, string>();
	const seenRoutes = new Map<string, string>();
	const docRefs = new Map<string, string[]>();

	for (const filePath of allSourceFiles) {
		const sourceText = fs.readFileSync(filePath, 'utf8');
		const sourceModule = toSourceModule(srcRoot, filePath);
		const moduleData = extractModuleDocData(sourceText, filePath, sourceModule);

		for (const entry of moduleData.entries) {
			const sourceRef = `${entry.sourceModule}:${entry.exportName}`;
			const priorId = seenIds.get(entry.id);
			if (priorId) {
				throw new Error(
					`Duplicate DocBlock id ${entry.id} in ${sourceRef} and ${priorId}`
				);
			}
			seenIds.set(entry.id, sourceRef);

			if (entry.block.route) {
				const priorRoute = seenRoutes.get(entry.block.route);
				if (priorRoute) {
					throw new Error(
						`Duplicate DocBlock route ${entry.block.route} in ${sourceRef} and ${priorRoute}`
					);
				}
				seenRoutes.set(entry.block.route, sourceRef);
			}

			entries.push(entry);
		}

		if (moduleData.docRefs.length > 0) {
			docRefs.set(sourceModule, moduleData.docRefs);
		}
	}

	for (const [sourceModule, refs] of docRefs) {
		for (const ref of refs) {
			if (!seenIds.has(ref)) {
				throw new Error(
					`Missing DocBlock reference ${ref} from ${sourceModule}`
				);
			}
		}
	}

	entries.sort((left, right) => left.id.localeCompare(right.id));

	return {
		packageName,
		generatedAt,
		blocks: entries,
	};
}
