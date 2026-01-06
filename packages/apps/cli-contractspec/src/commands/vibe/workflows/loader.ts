
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import yaml from 'js-yaml';
import { workflows as builtinWorkflows } from './definitions';
import type { Workflow } from './types';
import { findWorkspaceRoot } from '@contractspec/bundle.workspace';

export async function loadWorkflows(): Promise<Workflow[]> {
  const allWorkflows = [...builtinWorkflows];
  
  const cwd = process.cwd();
  const root = findWorkspaceRoot(cwd) || cwd;
  const userWorkflowsDir = join(root, '.contractspec', 'vibe', 'workflows');

  if (existsSync(userWorkflowsDir)) {
      try {
          const files = await readdir(userWorkflowsDir);
          for (const file of files) {
              if (file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.yml')) {
                  const content = await readFile(join(userWorkflowsDir, file), 'utf-8');
                  try {
                      let wf: Workflow;
                      if (file.endsWith('.json')) {
                          wf = JSON.parse(content) as Workflow;
                      } else {
                          wf = yaml.load(content) as Workflow;
                      }
                      
                      // Simple check
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

export async function getWorkflow(id: string): Promise<Workflow | undefined> {
    const all = await loadWorkflows();
    return all.find(w => w.id === id);
}
