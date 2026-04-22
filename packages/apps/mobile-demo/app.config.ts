import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	name: 'ContractSpec',
	slug: 'contractspec-demo',
	owner: 'lssm',
	version: '0.1.1',
	orientation: 'portrait',
	icon: './assets/icon.png',
	scheme: 'contractspec-demo',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './assets/splash-icon.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	ios: {
		supportsTablet: true,
		bundleIdentifier: 'io.contractspec.expo-demo',
		infoPlist: {
			ITSAppUsesNonExemptEncryption: false,
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
		package: 'io.contractspec.expo_demo',
	},
	plugins: ['expo-router'],
	extra: {
		eas: {
			projectId: '3fa47df4-8d6b-4afb-8713-013b09af6204',
		},
	},
});
