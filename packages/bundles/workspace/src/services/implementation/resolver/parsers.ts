/**
 * Parser utilities for extracting implementation references from source code.
 */

import type {
  ImplementationRef,
  ImplementationType,
} from '@contractspec/lib.contracts';
import { Node, Project, SyntaxKind } from 'ts-morph';

/**
 * Parse explicit implementations from spec source code using ts-morph.
 * Looks for: implementations: [{ path: '...', type: '...' }] inside the main spec object.
 */
export function parseExplicitImplementations(
  code: string
): ImplementationRef[] {
  const implementations: ImplementationRef[] = [];
  const project = new Project({ useInMemoryFileSystem: true });
  // Create a SourceFile
  const sourceFile = project.createSourceFile('spec.ts', code);

  // Helper to extract fields from an object literal
  const extractImpls = (obj: Node) => {
    if (!Node.isObjectLiteralExpression(obj)) return;
    const prop = obj.getProperty('implementations');
    if (prop && Node.isPropertyAssignment(prop)) {
      const init = prop.getInitializer();
      if (init && Node.isArrayLiteralExpression(init)) {
        for (const elem of init.getElements()) {
          if (Node.isObjectLiteralExpression(elem)) {
            let pathVal: string | undefined;
            let typeVal: ImplementationType | undefined;
            let descVal: string | undefined;

            const pathProp = elem.getProperty('path');
            if (pathProp && Node.isPropertyAssignment(pathProp)) {
              const init = pathProp.getInitializer();
              if (Node.isStringLiteral(init)) {
                pathVal = init.getLiteralText();
              }
            }

            const typeProp = elem.getProperty('type');
            if (typeProp && Node.isPropertyAssignment(typeProp)) {
              const init = typeProp.getInitializer();
              if (Node.isStringLiteral(init)) {
                typeVal = init.getLiteralText() as ImplementationType;
              }
            }

            const descProp = elem.getProperty('description');
            if (descProp && Node.isPropertyAssignment(descProp)) {
              const init = descProp.getInitializer();
              if (Node.isStringLiteral(init)) {
                descVal = init.getLiteralText();
              }
            }

            if (pathVal && typeVal) {
              implementations.push({
                path: pathVal,
                type: typeVal,
                description: descVal,
              });
            }
          }
        }
      }
    }
  };

  // Find the spec object
  // 1. defineCommand/Event/etc CallExpression
  // 2. Exported object literal or variable

  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );
  for (const call of callExpressions) {
    const expr = call.getExpression().getText();
    if (
      ['defineCommand', 'defineQuery', 'defineEvent', 'defineFeature'].includes(
        expr
      )
    ) {
      const args = call.getArguments();
      if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
        extractImpls(args[0]);
        return implementations; // Assume only one main definition per file
      }
    }
  }

  // Fallback: search exported variables
  const varStmts = sourceFile.getVariableStatements();
  for (const stmt of varStmts) {
    if (stmt.isExported()) {
      for (const decl of stmt.getDeclarations()) {
        const init = decl.getInitializer();
        if (init && Node.isObjectLiteralExpression(init)) {
          // Check if it has 'implementations'
          if (init.getProperty('implementations')) {
            extractImpls(init);
            return implementations;
          }
        }
      }
    }
  }

  // Fallback: default export
  const exportAssign = sourceFile.getExportAssignment(
    (d) => !d.isExportEquals()
  );
  if (exportAssign) {
    const expr = exportAssign.getExpression();
    if (Node.isObjectLiteralExpression(expr)) {
      extractImpls(expr);
    } else if (
      Node.isAsExpression(expr) &&
      Node.isObjectLiteralExpression(expr.getExpression())
    ) {
      extractImpls(expr.getExpression());
    }
  }

  return implementations;
}
