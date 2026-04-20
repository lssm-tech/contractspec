/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');
const {
	withPresentationMetroAliases,
} = require('@contractspec/lib.presentation-runtime-core');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

module.exports = withNativewind(
	withPresentationMetroAliases(config, {
		monorepoRoot: require('path').resolve(projectRoot, '../..'),
	})
);
