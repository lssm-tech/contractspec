import {
  Project,
  Node,
  SyntaxKind,
  type ObjectLiteralExpression,
} from 'ts-morph';
import type { RefInfo } from '../types/analysis-types';

/**
 * Extract specs referenced in a feature.
 * Uses ts-morph for robust parsing of object structures.
 */
export function extractFeatureRefs(code: string): {
  operations: RefInfo[];
  events: RefInfo[];
  presentations: RefInfo[];
  experiments: RefInfo[];
  capabilities: { provides: RefInfo[]; requires: RefInfo[] };
  opToPresentationLinks: { op: RefInfo; pres: RefInfo }[];
  presentationsTargets: {
    key: string;
    version: string;
    targets: Record<string, unknown>[];
  }[];
} {
  const result = {
    operations: [] as RefInfo[],
    events: [] as RefInfo[],
    presentations: [] as RefInfo[],
    experiments: [] as RefInfo[],
    capabilities: {
      provides: [] as RefInfo[],
      requires: [] as RefInfo[],
    },
    opToPresentationLinks: [] as { op: RefInfo; pres: RefInfo }[],
    presentationsTargets: [] as {
      key: string;
      version: string;
      targets: Record<string, unknown>[];
    }[],
  };

  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile('feature.ts', code);

  // Helper to extract ref array from an object property
  const extractRefs = (
    obj: ObjectLiteralExpression,
    propName: string,
    allowKeyOnly = false
  ): RefInfo[] => {
    const refs: RefInfo[] = [];
    const prop = obj.getProperty(propName);

    if (prop && Node.isPropertyAssignment(prop)) {
      const init = prop.getInitializer();
      if (init && Node.isArrayLiteralExpression(init)) {
        for (const elem of init.getElements()) {
          if (Node.isObjectLiteralExpression(elem)) {
            const keyText = getTextFromProp(elem, 'key');
            const verText = getTextFromProp(elem, 'version');

            if (keyText && verText) {
              refs.push({ key: keyText, version: verText });
            } else if (keyText && allowKeyOnly) {
              refs.push({ key: keyText, version: '1.0.0' });
            }
          }
        }
      }
    }
    return refs;
  };

  // Find defineFeature call
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );

  for (const call of callExpressions) {
    if (
      ['defineFeature', 'defineAppConfig', 'defineAppBlueprint'].includes(
        call.getExpression().getText()
      )
    ) {
      const args = call.getArguments();
      if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
        const obj = args[0];

        // Extract direct lists
        result.operations.push(...extractRefs(obj, 'operations'));
        result.events.push(...extractRefs(obj, 'events'));
        result.presentations.push(...extractRefs(obj, 'presentations'));
        result.experiments.push(...extractRefs(obj, 'experiments'));

        // Capabilities
        const capsProp = obj.getProperty('capabilities');
        if (capsProp && Node.isPropertyAssignment(capsProp)) {
          const capsObj = capsProp.getInitializer();
          if (capsObj && Node.isObjectLiteralExpression(capsObj)) {
            result.capabilities.provides.push(
              ...extractRefs(capsObj, 'provides')
            );
            result.capabilities.requires.push(
              ...extractRefs(capsObj, 'requires', true)
            );
          }
        }

        // Op to Presentation Links
        // explicit 'opToPresentation' field
        const linksProp = obj.getProperty('opToPresentation');
        if (linksProp && Node.isPropertyAssignment(linksProp)) {
          const linksArr = linksProp.getInitializer();
          if (linksArr && Node.isArrayLiteralExpression(linksArr)) {
            linksArr.getElements().forEach((link) => {
              if (Node.isObjectLiteralExpression(link)) {
                const opProp = link.getProperty('op');
                const presProp = link.getProperty('pres');

                let opRef: RefInfo | undefined;
                let presRef: RefInfo | undefined;

                if (opProp && Node.isPropertyAssignment(opProp)) {
                  const val = opProp.getInitializer();
                  if (val && Node.isObjectLiteralExpression(val)) {
                    const key = getTextFromProp(val, 'key');
                    const version = getTextFromProp(val, 'version');
                    if (key && version) opRef = { key, version };
                  }
                }
                if (presProp && Node.isPropertyAssignment(presProp)) {
                  const val = presProp.getInitializer();
                  if (val && Node.isObjectLiteralExpression(val)) {
                    const key = getTextFromProp(val, 'key');
                    const version = getTextFromProp(val, 'version');
                    if (key && version) presRef = { key, version };
                  }
                }

                if (opRef && presRef) {
                  result.opToPresentationLinks.push({
                    op: opRef,
                    pres: presRef,
                  });
                }
              }
            });
          }
        }

        // Also support 'interactions' style for forward compatibility
        extractLinks(obj, result.opToPresentationLinks);

        // Presentation Targets
        // explicit 'presentationsTargets' field
        const targetsProp = obj.getProperty('presentationsTargets');
        if (targetsProp && Node.isPropertyAssignment(targetsProp)) {
          const targetsArr = targetsProp.getInitializer();
          if (targetsArr && Node.isArrayLiteralExpression(targetsArr)) {
            targetsArr.getElements().forEach((targetBlock) => {
              if (Node.isObjectLiteralExpression(targetBlock)) {
                const key = getTextFromProp(targetBlock, 'key');
                const version = getTextFromProp(targetBlock, 'version');
                const targetsList = getTargetsList(targetBlock, 'targets');

                if (key && version && targetsList) {
                  result.presentationsTargets.push({
                    key,
                    version,
                    targets: targetsList as Record<string, unknown>[],
                  });
                }
              }
            });
          }
        }

        // Also support inline targets in presentations list
        extractPresentationTargets(obj, result.presentationsTargets);
      }
    }
  }

  return result;
}

function extractLinks(
  obj: ObjectLiteralExpression,
  opToPresentationLinks: { op: RefInfo; pres: RefInfo }[]
): void {
  const interactionsProp = obj.getProperty('interactions');
  if (interactionsProp && Node.isPropertyAssignment(interactionsProp)) {
    const interactionsArr = interactionsProp.getInitializer();
    if (interactionsArr && Node.isArrayLiteralExpression(interactionsArr)) {
      interactionsArr.getElements().forEach((interaction) => {
        if (Node.isObjectLiteralExpression(interaction)) {
          // Check: trigger: { type: 'presentation', presentation: { key, version } }
          // Check: action: { type: 'operation', operation: { key, version } }

          const triggerProp = interaction.getProperty('trigger');
          const triggerObj =
            triggerProp &&
            Node.isPropertyAssignment(triggerProp) &&
            triggerProp.getInitializer();

          const actionProp = interaction.getProperty('action');
          const actionObj =
            actionProp &&
            Node.isPropertyAssignment(actionProp) &&
            actionProp.getInitializer();

          if (
            triggerObj &&
            Node.isObjectLiteralExpression(triggerObj) &&
            actionObj &&
            Node.isObjectLiteralExpression(actionObj)
          ) {
            const triggerType = getTextFromProp(triggerObj, 'type');
            const actionType = getTextFromProp(actionObj, 'type');

            if (triggerType === 'presentation' && actionType === 'operation') {
              const presRef = extractNestedRef(triggerObj, 'presentation');
              const opRef = extractNestedRef(actionObj, 'operation');

              if (presRef && opRef) {
                opToPresentationLinks.push({ op: opRef, pres: presRef });
              }
            }
          }
        }
      });
    }
  }
}

function extractNestedRef(
  obj: ObjectLiteralExpression,
  propName: string
): RefInfo | undefined {
  const prop = obj.getProperty(propName);
  if (prop && Node.isPropertyAssignment(prop)) {
    const val = prop.getInitializer();
    if (val && Node.isObjectLiteralExpression(val)) {
      const key = getTextFromProp(val, 'key');
      const version = getTextFromProp(val, 'version');
      if (key && version) return { key, version };
    }
  }
  return undefined;
}

function extractPresentationTargets(
  obj: ObjectLiteralExpression,
  presentationsTargets: {
    key: string;
    version: string;
    targets: Record<string, unknown>[];
  }[]
): void {
  const presentationsProp = obj.getProperty('presentations');
  if (presentationsProp && Node.isPropertyAssignment(presentationsProp)) {
    const presentationsArr = presentationsProp.getInitializer();
    if (presentationsArr && Node.isArrayLiteralExpression(presentationsArr)) {
      for (const elem of presentationsArr.getElements()) {
        if (Node.isObjectLiteralExpression(elem)) {
          const keyText = getTextFromProp(elem, 'key');
          const verText = getTextFromProp(elem, 'version');

          // Use targets extraction from shared utility or local helper
          const targetsList = getTargetsList(elem, 'targets');

          if (keyText && verText && targetsList) {
            presentationsTargets.push({
              key: keyText,
              version: verText,
              targets: targetsList as Record<string, unknown>[],
            });
          }
        }
      }
    }
  }
}

function getTextFromProp(
  obj: ObjectLiteralExpression,
  propName: string
): string | undefined {
  const prop = obj.getProperty(propName);
  if (prop && Node.isPropertyAssignment(prop)) {
    const init = prop.getInitializer();
    if (init && Node.isStringLiteral(init)) {
      return init.getLiteralText();
    }
  }
  return undefined;
}

function getTargetsList(
  obj: ObjectLiteralExpression,
  propName: string
): unknown[] | undefined {
  const prop = obj.getProperty(propName);
  if (prop && Node.isPropertyAssignment(prop)) {
    const init = prop.getInitializer();
    if (init && Node.isArrayLiteralExpression(init)) {
      // Just extract strings for now, or raw text if they are identifiers/enums
      return init.getElements().map((e) => {
        if (Node.isStringLiteral(e)) return e.getLiteralText();
        // Fallback: create a dummy record to match the Expected type in the rest of the app
        return { target: e.getText() } as unknown;
      });
    }
  }
  return undefined;
}
