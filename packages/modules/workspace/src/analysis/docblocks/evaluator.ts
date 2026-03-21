import ts from "typescript";
import type {
	DocBlock,
	DocBlockManifestEntry,
} from "@contractspec/lib.contracts-spec/docs";
import {
	type JsonValue,
	collectLocalValues,
	evaluateExpression,
} from "./static-values";

export interface ModuleDocAnalysis {
	entries: DocBlockManifestEntry[];
	docRefs: string[];
}

function isDocBlockValue(value: unknown): value is DocBlock {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return false;
	}

	const candidate = value as Record<string, unknown>;
	return (
		typeof candidate.id === "string" &&
		typeof candidate.title === "string" &&
		typeof candidate.body === "string"
	);
}

function extractDocRefsFromExpression(
	expression: ts.Expression,
	locals: Map<string, JsonValue>,
	filePath: string,
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
			ts.isPropertyAssignment(property) && property.name.getText() === "meta",
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
			ts.isPropertyAssignment(property) && property.name.getText() === "docId",
	);
	if (!docIdProperty || !ts.isPropertyAssignment(docIdProperty)) {
		return [];
	}

	const refs = evaluateExpression(docIdProperty.initializer, locals, filePath);
	if (!Array.isArray(refs) || !refs.every((entry) => typeof entry === "string")) {
		throw new Error(
			`Non-static DocBlock reference in ${filePath} at ${docIdProperty.initializer.getStart()}`,
		);
	}

	return refs;
}

export function extractModuleDocData(
	sourceText: string,
	filePath: string,
	sourceModule: string,
): ModuleDocAnalysis {
	const sourceFile = ts.createSourceFile(
		filePath,
		sourceText,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS,
	);
	const locals = collectLocalValues(sourceFile, filePath);
	const entries: DocBlockManifestEntry[] = [];
	const docRefs = new Set<string>();

	for (const statement of sourceFile.statements) {
		if (!ts.isVariableStatement(statement)) {
			continue;
		}

		const isExported = statement.modifiers?.some(
			(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
		);
		if (!isExported) {
			continue;
		}

		for (const declaration of statement.declarationList.declarations) {
			if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
				continue;
			}

			const value = evaluateExpression(declaration.initializer, locals, filePath);
			for (const ref of extractDocRefsFromExpression(
				declaration.initializer,
				locals,
				filePath,
			)) {
				docRefs.add(ref);
			}

			if (value === undefined) {
				if (
					declaration.name.text.includes("DocBlock") ||
					declaration.initializer
						.getText(sourceFile)
						.includes("satisfies DocBlock")
				) {
					throw new Error(
						`Non-static DocBlock source in ${filePath} at ${declaration.initializer.getStart(sourceFile)}`,
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

			if (Array.isArray(value) && value.every((entry) => isDocBlockValue(entry))) {
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
