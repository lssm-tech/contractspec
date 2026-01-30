#!/usr/bin/env node

/**
 * Execute ContractSpec operation and return JSON result.
 * Usage: node operation-executor.js <operationKey> <operationVersion> <inputJson>
 */

const path = require('path');

async function executeOperation(operationKey, version, input) {
  try {
    // Load workspace bundle registry
    const registryPath = path.resolve(
      process.cwd(),
      'packages/bundles/workspace/src/registry.cjs'
    );

    // Dynamic import to load TypeScript module
    const { operationRegistry } = await import(registryPath);

    // Create minimal context for operation execution
    const ctx = {
      actor: 'anonymous',
      channel: 'ci',
      traceId: `ci-${Date.now()}`,
    };

    // Execute operation
    const result = await operationRegistry.execute(
      operationKey,
      version,
      input,
      ctx
    );

    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          error: error.message,
          stack: error.stack,
        },
        null,
        2
      )
    );
    process.exit(1);
  }
}
