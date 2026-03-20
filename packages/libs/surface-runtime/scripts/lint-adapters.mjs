#!/usr/bin/env node
/**
 * Enforces adapter rule: no direct third-party UI imports outside src/adapters/.
 * Forbidden: @blocknote/*, @dnd-kit/*, @floating-ui/*, framer-motion, motion,
 * react-resizable-panels, @ai-sdk/* (except when in adapters).
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ADAPTER_DIR = 'src/adapters';
const FORBIDDEN_PATTERNS = [
	/from\s+['"]@blocknote\//,
	/from\s+['"]@dnd-kit\//,
	/from\s+['"]@floating-ui\//,
	/from\s+['"]framer-motion['"]/,
	/from\s+['"]motion['"]/,
	/from\s+['"]react-resizable-panels['"]/,
	/from\s+['"]@ai-sdk\/ui['"]/,
];

function* walk(dir, base = '') {
	const entries = readdirSync(dir, { withFileTypes: true });
	for (const e of entries) {
		const rel = join(base, e.name);
		if (e.isDirectory()) {
			yield* walk(join(dir, e.name), rel);
		} else if (e.isFile() && /\.(ts|tsx|js|jsx)$/.test(e.name)) {
			yield { path: rel, full: join(dir, e.name) };
		}
	}
}

function isInAdapters(rel) {
	return (
		rel.startsWith(ADAPTER_DIR + '/') || rel.startsWith(ADAPTER_DIR + '\\')
	);
}

let failed = 0;
const pkgRoot = join(__dirname, '..');
const srcDir = join(pkgRoot, 'src');

for (const { path: rel, full } of walk(srcDir, 'src')) {
	if (isInAdapters(rel)) continue;

	const content = readFileSync(full, 'utf8');
	for (const pattern of FORBIDDEN_PATTERNS) {
		if (pattern.test(content)) {
			console.error(
				`[lint:adapters] ${rel}: forbidden third-party UI import (adapter rule). Use src/adapters/ instead.`
			);
			failed++;
		}
	}
}

if (failed > 0) {
	process.exit(1);
}
