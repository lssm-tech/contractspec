// Prevent forbidden cross-surface imports (e.g., native ui-kit in web code).
const DEFAULT_FORBIDDEN = [
  {
    path: '@lssm/lib.ui-kit',
    message:
      'Do not import native ui-kit in web code. Use @lssm/lib.design-system or @lssm/lib.ui-kit-web.',
  },
];

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce design import boundaries (no native ui-kit in web; prefer design-system).',
    },
    schema: [
      {
        type: 'object',
        properties: {
          forbidden: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                message: { type: 'string' },
              },
              required: ['path'],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      forbiddenImport: '{{message}}',
    },
  },
  create(context) {
    const forbidden = context.options[0]?.forbidden || DEFAULT_FORBIDDEN;
    const pathToMessage = new Map(
      forbidden.map((f) => [f.path, f.message || `Import "${f.path}" is forbidden here.`])
    );

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (pathToMessage.has(source)) {
          context.report({
            node: node.source,
            messageId: 'forbiddenImport',
            data: { message: pathToMessage.get(source) },
          });
        }
      },
    };
  },
};

export default rule;




