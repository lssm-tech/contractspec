import { RuleTester } from 'eslint';
import plugin from '../src/index.js';

const preferRule = plugin.rules['prefer-design-system'];
const typographyRule = plugin.rules['no-intrinsic-typography'];
const boundaryRule = plugin.rules['design-import-boundary'];

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('prefer-design-system', preferRule, {
  valid: [
    {
      code: `
        import { Button } from '@lssm/lib.design-system';
        const View = () => <Button />;
      `,
    },
    {
      code: `
        const View = () => <Card />;
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { Button } from '@lssm/lib.ui-kit-web/ui/button';
        const View = () => <Button />;
      `,
      output: `
        import { Button } from '@lssm/lib.design-system';
        const View = () => <Button />;
      `,
      errors: [{ messageId: 'preferDSImport' }],
    },
    {
      code: `
        const View = () => <div />;
      `,
      output: null,
      options: [{ intrinsicDisallowList: ['div'] }],
      errors: [{ messageId: 'avoidIntrinsic' }],
    },
  ],
});

ruleTester.run('prefer-design-system allowlist', preferRule, {
  valid: [
    {
      code: `
        import { Button } from './components/Button';
        const View = () => <Button />;
      `,
      options: [{ localAllowPatterns: ['^\\./components'] }],
    },
  ],
  invalid: [],
});

ruleTester.run('no-intrinsic-typography', typographyRule, {
  valid: [
    {
      code: `
        const View = () => <Heading>Title</Heading>;
      `,
    },
    {
      code: `
        const View = () => <h1 />;
      `,
      options: [{ allow: ['h1'] }],
    },
  ],
  invalid: [
    {
      code: `
        const View = () => <h2 />;
      `,
      errors: [{ messageId: 'avoidIntrinsicTypography' }],
    },
    {
      code: `
        const View = () => <p />;
      `,
      errors: [{ messageId: 'avoidIntrinsicTypography' }],
    },
  ],
});

ruleTester.run('design-import-boundary', boundaryRule, {
  valid: [
    {
      code: `import { Button } from '@lssm/lib.design-system';`,
    },
    {
      code: `import { Button } from '@lssm/lib.ui-kit-web/ui/button';`,
      options: [{ forbidden: [{ path: '@lssm/lib.ui-kit' }] }],
    },
  ],
  invalid: [
    {
      code: `import { Foo } from '@lssm/lib.ui-kit';`,
      errors: [{ messageId: 'forbiddenImport' }],
    },
  ],
});




