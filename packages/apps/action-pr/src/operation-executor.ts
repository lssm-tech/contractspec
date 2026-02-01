#!/usr/bin/env node

/**
 * Execute ContractSpec operation and return JSON result.
 * Usage: node operation-executor.js <operationKey> <operationVersion> <inputJson>
 */

import { operationRegistry } from '@contractspec/bundle.workspace';
import type { HandlerCtx } from '@contractspec/lib.contracts';

async function executeOperation(
  operationKey: string,
  version: string,
  input: unknown
) {
  try {
    // Create minimal context for operation execution
    const ctx: HandlerCtx = {
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
    if (error instanceof Error) {
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
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Parse command line arguments
const [operationKey, version, inputJson] = process.argv.slice(2);

if (!operationKey || !version || !inputJson) {
  console.error(
    'Usage: node operation-executor.js <operationKey> <operationVersion> <inputJson>'
  );
  process.exit(1);
}

let input;
try {
  input = JSON.parse(inputJson);
} catch (error) {
  if (error instanceof Error) {
    console.error('Invalid JSON input:', error.message);
  } else {
    console.error('Invalid JSON input:', error);
  }
  process.exit(1);
}

executeOperation(operationKey, version, input);
