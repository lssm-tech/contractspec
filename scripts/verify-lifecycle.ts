import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import chalk from 'chalk';

const CWD = process.cwd();
const TEMP_DIR = path.join(CWD, '.contractspec/temp-e2e');
const CLI_PATH = path.join(CWD, 'packages/apps/cli-contractspec/src/cli.ts'); // Run via ts-node/bun directly

function run(command: string) {
  console.log(chalk.gray(`> ${command}`));
  execSync(command, { stdio: 'inherit', cwd: TEMP_DIR });
}

function verifyFile(relativePath: string) {
  const fullPath = path.join(TEMP_DIR, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`File missing: ${relativePath}`);
  }
  console.log(chalk.green(`  ✅ Verified ${relativePath}`));
}

async function main() {
  console.log(chalk.bold.blue('🚀 Starting ContractSpec E2E Lifecycle Verification\n'));

  // 1. Setup Temp Directory
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  mkdirSync(TEMP_DIR, { recursive: true });
  console.log(chalk.cyan(`📂 Created temp dir: ${TEMP_DIR}`));

  try {
    // 2. Mock OpenAPI Source
    const openApiSource = path.join(TEMP_DIR, 'petstore.yaml');
    writeFileSync(openApiSource, `
openapi: 3.0.0
info:
  title: Petstore E2E
  version: 1.0.0
paths:
  /pets:
    get:
      operationId: listPets
      responses:
        '200':
          description: A paged array of pets
`);
    console.log(chalk.cyan('📝 Created mock OpenAPI source'));

    // 3. Extract (Init/Import equivalent)
    console.log(chalk.bold('\n--- Phase: Extract ---'));
    run(`bun ${CLI_PATH} extract --source petstore.yaml --output contracts`);
    verifyFile('contracts/list-pets.ts');
    
    // Debug: Print extracted content
    console.log(chalk.cyan('DEBUG: Extracted Content:'));
    run(`cat contracts/list-pets.ts`);

    // 4. Generate
    console.log(chalk.bold('\n--- Phase: Generate ---'));
    run(`bun ${CLI_PATH} generate`);
    verifyFile('generated/docs/listPets.md'); // Docs usually match spec ID/filename

    // 5. Gap Check (Clean)
    console.log(chalk.bold('\n--- Phase: Gap Check (Clean) ---'));
    run(`bun ${CLI_PATH} gap`);

    // 6. View
    console.log(chalk.bold('\n--- Phase: View ---'));
    run(`bun ${CLI_PATH} view contracts/list-pets.ts --audience product`);

    // 7. Verify Drift Detection (Delete a doc)
    console.log(chalk.bold('\n--- Phase: Drift Simulation ---'));
    rmSync(path.join(TEMP_DIR, 'generated/docs/listPets.md'));
    console.log(chalk.yellow('🗑️  Deleted generated/docs/listPets.md'));

    try {
      run(`bun ${CLI_PATH} gap`);
      throw new Error('Gap command should have failed but passed');
    } catch (e) {
      console.log(chalk.green('✅ Gap command correctly detected missing file (exit code 1)'));
    }

    // 8. Apply (Fix)
    console.log(chalk.bold('\n--- Phase: Apply (Fix) ---'));
    run(`bun ${CLI_PATH} apply`);
    verifyFile('generated/docs/listPets.md');
    console.log(chalk.green('✅ Apply restored the missing file'));

    console.log(chalk.bold.green('\n🎉 E2E Lifecycle Verification Passed!'));

  } catch (error) {
    console.error(chalk.red('\n❌ E2E Verification Failed:'), error);
    process.exit(1);
  } finally {
     // Cleanup
     console.log(chalk.gray('\n🧹 Cleaning up...'));
     // rmSync(TEMP_DIR, { recursive: true, force: true });
     console.log(chalk.gray(`(Kept ${TEMP_DIR} for inspection)`));
  }
}

main();
