import preferDesignSystem from './rules/prefer-design-system.js';
import noIntrinsicTypography from './rules/no-intrinsic-typography.js';
import designImportBoundary from './rules/design-import-boundary.js';

export const rules = {
  'prefer-design-system': preferDesignSystem.rules['prefer-design-system'],
  'no-intrinsic-typography': noIntrinsicTypography,
  'design-import-boundary': designImportBoundary,
};

export const configs = {
  recommended: {
    plugins: {
      'design-system': {
        rules,
      },
    },
    rules: {
      'design-system/prefer-design-system': 'error',
      'design-system/no-intrinsic-typography': 'error',
      'design-system/design-import-boundary': 'error',
    },
  },
};

export default {
  rules,
  configs,
};



