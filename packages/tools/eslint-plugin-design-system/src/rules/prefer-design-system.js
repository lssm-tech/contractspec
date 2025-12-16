// Custom ESLint rule to enforce design-system-first imports and discourage
// intrinsic layout/form elements in app/bundle code.
const DEFAULT_REPLACEMENTS = {
  '@lssm/lib.ui-kit-web/ui/button': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/input': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/textarea': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/cta': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/link': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/empty-state': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/loader': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/label': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/select': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/checkbox': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/radio-group': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/form': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/card': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/stack': '@lssm/lib.design-system',
  '@lssm/lib.ui-kit-web/ui/typography': '@lssm/lib.ui-kit-web/ui/typography', // allow typography to pass through
};

const DEFAULT_INTRINSIC = new Set([
  'div',
  'section',
  'main',
  'header',
  'footer',
  'nav',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'button',
  'input',
  'textarea',
  'select',
  'option',
  'form',
  'label',
]);

const preferDesignSystemRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer design-system imports and avoid intrinsic layout/form elements in app/bundle code.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          replacementMap: { type: 'object' },
          intrinsicDisallowList: { type: 'array', items: { type: 'string' } },
          allowIntrinsic: { type: 'array', items: { type: 'string' } },
          localAllowPatterns: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    fixable: 'code',
    messages: {
      preferDSImport:
        'Use design-system import instead of "{{from}}". Prefer "{{to}}".',
      avoidIntrinsic:
        'Use design-system layout/typography primitives instead of intrinsic <{{name}}> in app/bundle code.',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const replacementMap = {
      ...DEFAULT_REPLACEMENTS,
      ...(options.replacementMap || {}),
    };
    const intrinsicDisallowList = new Set(
      options.intrinsicDisallowList || DEFAULT_INTRINSIC
    );
    const allowIntrinsic = new Set(options.allowIntrinsic || []);
    const localAllowPatterns = (options.localAllowPatterns || []).map(
      (p) => new RegExp(p)
    );

    return {
      ImportDeclaration(node) {
        const sourceValue = node.source.value;
        const replacement = replacementMap[sourceValue];
        if (!replacement) return;
        if (!node.specifiers || node.specifiers.length === 0) return;
        if (localAllowPatterns.some((re) => re.test(sourceValue))) return;

        context.report({
          node: node.source,
          messageId: 'preferDSImport',
          data: { from: sourceValue, to: replacement },
          fix(fixer) {
            return fixer.replaceText(node.source, `'${replacement}'`);
          },
        });
      },
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const name = node.name.name;
        if (!name || name[0] !== name[0]?.toLowerCase?.()) return;
        if (allowIntrinsic.has(name)) return;
        if (!intrinsicDisallowList.has(name)) return;

        context.report({
          node: node.name,
          messageId: 'avoidIntrinsic',
          data: { name },
        });
      },
    };
  },
};

export const rules = {
  'prefer-design-system': preferDesignSystemRule,
};

export default {
  rules,
};










