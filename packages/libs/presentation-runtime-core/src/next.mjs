'use strict';

function withPresentationNextAliases(config, opts = {}) {
  const uiWeb = opts.uiKitWeb ?? '@contractspec/lib.ui-kit-web';
  const uiNative = opts.uiKitNative ?? '@contractspec/lib.ui-kit';
  const presReact =
    opts.presentationReact ?? '@contractspec/lib.presentation-runtime-react';
  const presNative =
    opts.presentationNative ??
    '@contractspec/lib.presentation-runtime-react-native';

  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    [uiNative]: uiWeb,
    [presNative]: presReact,
  };
  config.resolve.extensions = [
    '.web.js',
    '.web.jsx',
    '.web.ts',
    '.web.tsx',
    ...(config.resolve.extensions || []),
  ];
  return config;
}

export { withPresentationNextAliases };
