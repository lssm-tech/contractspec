#!/usr/bin/env node

/**
 * Script to migrate all package.json files to use Bun catalogs
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

// Define our catalog mappings
const CATALOG_MAPPINGS = {
    // Default catalog (catalog:)
    'react': 'catalog:',
    'react-dom': 'catalog:',
    'next': 'catalog:',
    'zod': 'catalog:',
    'typescript': 'catalog:',

    // Build catalog (catalog:build)
    'tsdown': 'catalog:build',
    'turbo': 'catalog:build',
    '@changesets/cli': 'catalog:build',
    'postcss': 'catalog:build',
    'tailwindcss': 'catalog:build',
    'eslint': 'catalog:build',
    'rimraf': 'catalog:build',
    'glob': 'catalog:build',

    // Testing catalog (catalog:testing)
    'jest': 'catalog:testing',
    '@types/jest': 'catalog:testing',
    'storybook': 'catalog:testing',

    // AI catalog (catalog:ai)
    'ai': 'catalog:ai',
    '@ai-sdk/mcp': 'catalog:ai',
    '@ai-sdk/anthropic': 'catalog:ai',
    '@ai-sdk/google': 'catalog:ai',
    '@ai-sdk/mistral': 'catalog:ai',
    '@ai-sdk/openai': 'catalog:ai',
    '@ai-sdk/react': 'catalog:ai',
    'ollama-ai-provider': 'catalog:ai',
};

function findPackageJsonFiles(dir, files = []) {
    const entries = readdirSync(dir);

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            if (entry !== 'node_modules' && entry !== 'dist' && entry !== '.turbo') {
                findPackageJsonFiles(fullPath, files);
            }
        } else if (entry === 'package.json') {
            files.push(fullPath);
        }
    }

    return files;
}

function updatePackageJson(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const pkg = JSON.parse(content);

    let changed = false;

    // Update dependencies
    if (pkg.dependencies) {
        for (const [depName, catalogRef] of Object.entries(CATALOG_MAPPINGS)) {
            if (pkg.dependencies[depName] && !pkg.dependencies[depName].startsWith('catalog:') && !pkg.dependencies[depName].startsWith('workspace:')) {
                pkg.dependencies[depName] = catalogRef;
                changed = true;
            }
        }
    }

    // Update devDependencies
    if (pkg.devDependencies) {
        for (const [depName, catalogRef] of Object.entries(CATALOG_MAPPINGS)) {
            if (pkg.devDependencies[depName] && !pkg.devDependencies[depName].startsWith('catalog:') && !pkg.devDependencies[depName].startsWith('workspace:')) {
                pkg.devDependencies[depName] = catalogRef;
                changed = true;
            }
        }
    }

    if (changed) {
        writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
        console.log(`✓ Updated: ${filePath}`);
        return true;
    }

    return false;
}

// Main execution
const packagesDir = process.argv[2] || './packages';
const packageJsonFiles = findPackageJsonFiles(packagesDir);

console.log(`Found ${packageJsonFiles.length} package.json files`);
console.log('Updating dependencies to use catalogs...\n');

let updatedCount = 0;
for (const file of packageJsonFiles) {
    if (updatePackageJson(file)) {
        updatedCount++;
    }
}

console.log(`\n✨ Updated ${updatedCount} package.json files`);
