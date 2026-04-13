function toPascalCase(str: string): string {
	return str
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
}

export interface FormSpecParams {
	key: string;
	version: string;
	title: string;
	description?: string;
	domain: string;
	owners: string[];
	tags: string[];
	stability?: 'experimental' | 'beta' | 'stable' | 'deprecated';
	primaryFieldKey: string;
	primaryFieldLabel: string;
	primaryFieldPlaceholder?: string;
	actionKey: string;
	actionLabel: string;
}

export function generateFormSpec(params: FormSpecParams): string {
	const baseName = toPascalCase(params.key);
	const modelName = `${baseName}FormModel`;
	const formName = `${baseName}Form`;

	return `/**
 * ${params.title} Form
 *
 * Auto-generated form spec.
 */

import { defineFormSpec } from '@contractspec/lib.contracts-spec/forms';
import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';

const ${modelName} = defineSchemaModel({
  name: '${modelName}',
  description: '${params.description || 'TODO: Add form model description'}',
  fields: {
    ${params.primaryFieldKey}: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
  },
});

export const ${formName} = defineFormSpec({
  meta: {
    key: '${params.key}',
    version: '${params.version}',
    title: '${params.title}',
    description: '${params.description || 'TODO: Add description'}',
    domain: '${params.domain}',
    owners: [${params.owners.map((owner) => `'${owner}'`).join(', ')}],
    tags: [${params.tags.map((tag) => `'${tag}'`).join(', ')}],
    stability: '${params.stability || 'beta'}',
  },
  model: ${modelName},
  fields: [
    {
      kind: 'text',
      name: '${params.primaryFieldKey}',
      labelI18n: '${params.primaryFieldLabel}',
      placeholderI18n: '${params.primaryFieldPlaceholder || 'TODO.placeholder'}',
      required: true,
    },
  ],
  actions: [
    {
      key: '${params.actionKey}',
      labelI18n: '${params.actionLabel}',
    },
  ],
  policy: {
    flags: [],
    pii: [],
  },
  renderHints: {
    ui: 'custom',
    form: 'react-hook-form',
  },
});
`;
}
