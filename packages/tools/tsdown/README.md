@lssm/tool.tsdown

Shared tsup config presets for the monorepo.

Usage in a package:

1. Add peer dependency tsup if not present
2. Create `tsup.config.js` extending a preset

```js
// tsup.config.js
import { defineConfig } from 'tsup';
import { reactLibrary } from '@lssm/tool.tsdown';

export default defineConfig((options) => ({
  ...reactLibrary,
  entry: ['src'],
}));
```

For Node libraries:

```js
import { defineConfig } from 'tsup';
import { nodeLib } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...nodeLib,
  entry: ['src'],
}));
```

Override per-package as needed (externals, entry, minify, etc.).
