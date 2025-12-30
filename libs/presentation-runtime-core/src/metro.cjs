'use strict';

function withPresentationMetroAliases(config, opts = {}) {
  const uiWeb = opts.uiKitWeb ?? '@contractspec/lib.ui-kit-web';
  const uiNative = opts.uiKitNative ?? '@contractspec/lib.ui-kit';
  const presReact =
    opts.presentationReact ?? '@contractspec/lib.presentation-runtime-react';
  const presNative =
    opts.presentationNative ??
    '@contractspec/lib.presentation-runtime-react-native';

  config.resolver = config.resolver || {};
  config.resolver.unstable_enablePackageExports = true;
  config.resolver.platforms = [
    'ios',
    'android',
    'native',
    'mobile',
    'web',
    ...(config.resolver.platforms || []),
  ];

  const original = config.resolver.resolveRequest;
  config.resolver.resolveRequest = (ctx, moduleName, platform) => {
    if (
      platform === 'ios' ||
      platform === 'android' ||
      platform === 'native' ||
      platform === 'mobile'
    ) {
      if (
        typeof moduleName === 'string' &&
        moduleName.startsWith(uiWeb + '/ui')
      ) {
        const mapped = moduleName.replace(uiWeb + '/ui', uiNative + '/ui');
        return (original || ctx.resolveRequest)(ctx, mapped, platform);
      }
      if (moduleName === presReact) {
        return (original || ctx.resolveRequest)(ctx, presNative, platform);
      }
    }
    return (original || ctx.resolveRequest)(ctx, moduleName, platform);
  };

  return config;
}

module.exports = { withPresentationMetroAliases };
