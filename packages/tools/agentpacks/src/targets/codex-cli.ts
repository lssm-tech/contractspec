import { join, resolve } from 'path';
import type { FeatureId } from '../core/config.js';
import { resolveHooksForTarget } from '../features/hooks.js';
import { ruleMatchesTarget } from '../features/rules.js';
import { serializeSkill, skillMatchesTarget } from '../features/skills.js';
import {
	ensureDir,
	removeIfExists,
	writeGeneratedFile,
	writeGeneratedJson,
} from '../utils/filesystem.js';
import {
	BaseTarget,
	type GenerateOptions,
	type GenerateResult,
} from './base-target.js';

const TARGET_ID = 'codexcli';

/**
 * Codex CLI target generator.
 * Generates: .codex/memories/, .codex/skills/
 */
export class CodexCliTarget extends BaseTarget {
	readonly id = TARGET_ID;
	readonly name = 'Codex CLI';

	readonly supportedFeatures: FeatureId[] = ['rules', 'skills', 'mcp', 'hooks'];

	generate(options: GenerateOptions): GenerateResult {
		const { projectRoot, baseDir, features, enabledFeatures, deleteExisting } =
			options;
		const root = resolve(projectRoot, baseDir);
		const effective = this.getEffectiveFeatures(enabledFeatures);
		const filesWritten: string[] = [];
		const filesDeleted: string[] = [];
		const warnings: string[] = [];

		const codexDir = resolve(root, '.codex');

		if (effective.includes('rules')) {
			const memoriesDir = resolve(codexDir, 'memories');
			if (deleteExisting) {
				safelyRemove(memoriesDir, filesDeleted, warnings);
			}
			ensureDir(memoriesDir);

			const rules = features.rules.filter((r) =>
				ruleMatchesTarget(r, TARGET_ID)
			);
			for (const rule of rules) {
				// Codex uses flat memories directory (no root/detail distinction)
				const filepath = join(memoriesDir, `${rule.name}.md`);
				writeGeneratedFile(filepath, rule.content);
				filesWritten.push(filepath);
			}
		}

		if (effective.includes('skills')) {
			const skillsDir = resolve(codexDir, 'skills');
			if (deleteExisting) {
				safelyRemove(skillsDir, filesDeleted, warnings);
			}
			ensureDir(skillsDir);

			const skills = features.skills.filter((s) =>
				skillMatchesTarget(s, TARGET_ID)
			);
			for (const skill of skills) {
				const skillSubDir = join(skillsDir, skill.name);
				ensureDir(skillSubDir);
				const filepath = join(skillSubDir, 'SKILL.md');
				writeGeneratedFile(filepath, serializeSkill(skill));
				filesWritten.push(filepath);
			}
		}

		if (effective.includes('hooks')) {
			const hooksFilepath = resolve(codexDir, 'hooks.json');
			if (deleteExisting) {
				safelyRemove(hooksFilepath, filesDeleted, warnings);
			}

			const mergedHooks: Record<string, unknown[]> = {};
			for (const hookSet of features.hooks) {
				const events = resolveHooksForTarget(hookSet, TARGET_ID);
				for (const [event, entries] of Object.entries(events)) {
					if (!mergedHooks[event]) {
						mergedHooks[event] = [];
					}
					mergedHooks[event].push(...entries);
				}
			}

			if (Object.keys(mergedHooks).length > 0) {
				const hooksVersion =
					features.hooks.find((h) => h.version !== undefined)?.version ?? 1;
				writeGeneratedJson(
					hooksFilepath,
					{ version: hooksVersion, hooks: mergedHooks },
					{ header: false }
				);
				filesWritten.push(hooksFilepath);
			}
		}

		if (effective.includes('mcp')) {
			const mcpEntries = Object.entries(features.mcpServers);
			if (mcpEntries.length > 0) {
				const mcpServers: Record<string, unknown> = {};
				for (const [name, entry] of mcpEntries) {
					if (entry.url) {
						mcpServers[name] = { url: entry.url };
					} else if (entry.command) {
						mcpServers[name] = {
							command: entry.command,
							...(entry.args ? { args: entry.args } : {}),
							...(entry.env ? { env: entry.env } : {}),
						};
					}
				}
				if (Object.keys(mcpServers).length > 0) {
					const filepath = resolve(codexDir, 'mcp.json');
					writeGeneratedJson(filepath, { mcpServers }, { header: false });
					filesWritten.push(filepath);
				}
			}
		}

		return this.createResult(filesWritten, filesDeleted, warnings);
	}
}

function safelyRemove(
	targetPath: string,
	filesDeleted: string[],
	warnings: string[]
) {
	try {
		removeIfExists(targetPath);
		filesDeleted.push(targetPath);
	} catch (error) {
		warnings.push(
			`Could not remove ${targetPath}: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}
