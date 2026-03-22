import ts from 'typescript';

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export function evaluateExpression(
	expression: ts.Expression,
	locals: Map<string, JsonValue>,
	filePath: string
): JsonValue | undefined {
	if (ts.isParenthesizedExpression(expression)) {
		return evaluateExpression(expression.expression, locals, filePath);
	}

	if (ts.isSatisfiesExpression(expression) || ts.isAsExpression(expression)) {
		return evaluateExpression(expression.expression, locals, filePath);
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
				filePath
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
				filePath
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
		const parent = evaluateExpression(expression.expression, locals, filePath);
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
			return evaluateExpression(expression.arguments[0]!, locals, filePath);
		}
	}

	return undefined;
}

export function collectLocalValues(
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

			const value = evaluateExpression(
				declaration.initializer,
				locals,
				filePath
			);
			if (value !== undefined) {
				locals.set(declaration.name.text, value);
			}
		}
	}

	return locals;
}
