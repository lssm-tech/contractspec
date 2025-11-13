import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import {
  validateBlueprint,
  validateTenantConfig,
  type ValidateOptions,
} from '../packages/apps/contracts-cli/src/commands/validate/index';

type BlueprintTarget = {
  specFile: string;
  blueprint: string;
  tenantConfig?: string;
  options?: Pick<ValidateOptions, 'connections' | 'translationCatalog'>;
};

const targets: BlueprintTarget[] = [
  {
    specFile: 'packages/contractspec/examples/integration-stripe/blueprint.ts',
    blueprint: 'packages/contractspec/examples/integration-stripe/blueprint.ts',
    tenantConfig: 'packages/contractspec/examples/integration-stripe/tenant.ts',
    options: {
      connections: [
        'packages/contractspec/examples/integration-stripe/connection.sample.ts',
      ],
      translationCatalog:
        'packages/contractspec/examples/integration-stripe/translation.catalog.json',
      integrationRegistrars: [
        'packages/contractspec/packages/libs/contracts/src/integrations/providers/stripe.ts#registerStripeIntegration',
      ],
    },
  },
  {
    specFile: 'packages/contractspec/examples/knowledge-canon/blueprint.ts',
    blueprint: 'packages/contractspec/examples/knowledge-canon/blueprint.ts',
    tenantConfig: 'packages/contractspec/examples/knowledge-canon/tenant.ts',
  },
];

async function run() {
  let hasErrors = false;

  for (const target of targets) {
    console.log(
      chalk.bold(
        `\n=== ${path.relative(process.cwd(), target.specFile)} ===`
      )
    );

    const blueprintResult = await validateBlueprint(target.blueprint);
    let tenantValid = true;

    if (target.tenantConfig) {
      const tenantResult = await validateTenantConfig(
        blueprintResult.spec,
        target.tenantConfig,
        target.options ?? {}
      );
      tenantValid = tenantResult.report.valid;
    }

    if (!blueprintResult.report.valid || !tenantValid) {
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error(chalk.red('\n❌ Blueprint validation failed.'));
    process.exit(1);
  }

  console.log(chalk.green('\n✅ All blueprints validated successfully.'));
}

run().catch((error) => {
  console.error(chalk.red('\n❌ Unexpected error during validation.'));
  console.error(error);
  process.exit(1);
});

