/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig } = require('expo/metro-config');
const {
  withPresentationMetroAliases,
} = require('@contractspec/lib.presentation-runtime-core/src/metro.cjs');
const path = require('path');
const { withNativewind } = require('nativewind/metro');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../../../..');

const config = getDefaultConfig(projectRoot, {
  isCSSEnabled: true,
});

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

config.resolver.disableHierarchicalLookup = true;

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Block problematic directories
config.resolver.blockList = [
  // Block .next directories
  /(\.next)\/.*$/,
  // Block source files from workspace packages in production
  // /packages\/.*\/src\/.*$/,
];

// 4. Enable package exports for proper resolution
config.resolver.unstable_enablePackageExports = true;

// 5. Ensure proper platform resolution (add 'mobile' for .mobile.tsx support)
config.resolver.platforms = ['ios', 'android', 'native', 'mobile', 'web'];

// --- burnt ---
config.resolver.sourceExts.push('mjs');
config.resolver.sourceExts.push('cjs');
// --- end burnt ---

// // 6. Alias @ui-kit-web to @ui-kit on native via custom resolver
// // This keeps @design-system pointing to @ui-kit-web by default while
// // Metro swaps to @ui-kit when bundling for native.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // console.info('metro bundler', moduleName);
  if (
    typeof moduleName === 'string' &&
    (platform === 'ios' ||
      platform === 'android' ||
      platform === 'native' ||
      platform === 'mobile')
  ) {
    if (moduleName.startsWith('@contractspec/lib.ui-kit-web')) {
      // console.log('rewrite web to native');
      const mapped = moduleName.replace(
        '@contractspec/lib.ui-kit-web',
        '@contractspec/lib.ui-kit'
      );
      console.info('mapped', mapped, 'from', moduleName);
      return context.resolveRequest(context, mapped, platform);
    }
  }
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativewind(withPresentationMetroAliases(config), {
  inlineRem: 16,
});
// module.exports = withNativewind(config);
