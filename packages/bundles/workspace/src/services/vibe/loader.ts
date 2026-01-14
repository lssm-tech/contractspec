/**
 * Workflow loader.
 *
 * Loads built-in and user-defined workflows.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import yaml from 'js-yaml';
import { builtinWorkflows } from './definitions';
import type { Workflow } from './types';
import { findWorkspaceRoot } from '../../adapters/workspace';

/**
 * Load all workflows (built-in + user-defined).
 */
export async function loadWorkflows(cwd?: string): Promise<Workflow[]> {
  const allWorkflows = [...builtinWorkflows];

  const workingDir = cwd ?? process.cwd();
  const root = findWorkspaceRoot(workingDir) ?? workingDir;
  const userWorkflowsDir = join(root, '.contractspec', 'vibe', 'workflows');

  if (existsSync(userWorkflowsDir)) {
    try {
      const files = await readdir(userWorkflowsDir);
      for (const file of files) {
        if (
          file.endsWith('.json') ||
          file.endsWith('.yaml') ||
          file.endsWith('.yml')
        ) {
          const content = await readFile(join(userWorkflowsDir, file), 'utf-8');
          try {
            let wf: Workflow;
            if (file.endsWith('.json')) {
              wf = JSON.parse(content) as Workflow;
            } else {
              wf = yaml.load(content) as Workflow;
            }

            if (wf.id && wf.steps) {
              allWorkflows.push(wf);
            }
          } catch (e) {
            console.warn(`Failed to parse workflow ${file}:`, e);
          }
        }
      }
    } catch (e) {
      console.warn('Error loading user workflows:', e);
    }
  }

  return allWorkflows;
}

/**
 * Get a workflow by ID.
 */
export async function getWorkflow(
  id: string,
  cwd?: string
): Promise<Workflow | undefined> {
  const all = await loadWorkflows(cwd);
  return all.find((w) => w.id === id);
}
