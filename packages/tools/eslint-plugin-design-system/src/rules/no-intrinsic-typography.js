// Flags intrinsic typography tags (headings, paragraph, spans, emphasis) in app/bundle code.
const DEFAULT_BLOCKLIST = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'strong',
  'em',
]);

const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Use design-system typography primitives instead of intrinsic heading/paragraph/span tags.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      avoidIntrinsicTypography:
        'Use design-system typography primitives instead of intrinsic <{{name}}>.',
    },
  },
  create(context) {
    const allow = new Set(context.options[0]?.allow || []);
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const name = node.name.name;
        if (!name || name[0] !== name[0]?.toLowerCase?.()) return;
        if (allow.has(name)) return;
        if (!DEFAULT_BLOCKLIST.has(name)) return;

        context.report({
          node: node.name,
          messageId: 'avoidIntrinsicTypography',
          data: { name },
        });
      },
    };
  },
};

export default rule;







