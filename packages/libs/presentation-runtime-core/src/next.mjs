'use strict';

function withPresentationNextAliases(config, opts = {}) {
  const uiWeb = opts.uiKitWeb ?? '@lssm/lib.ui-kit-web';
  const uiNative = opts.uiKitNative ?? '@lssm/lib.ui-kit';
  const presReact =
    opts.presentationReact ?? '@lssm/lib.presentation-runtime-react';
  const presNative =
    opts.presentationNative ?? '@lssm/lib.presentation-runtime-react-native';

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
