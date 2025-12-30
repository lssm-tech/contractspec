import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  // slug: 'my-app',
  // name: 'My App',
  name: 'Studio ContractSpec',
  slug: 'contractspec-studio',
  version: '1.0.0',
  owner: 'lssm',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'contractspec',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'io.contractspec.studio',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription:
        'We use the camera so you can take a profile photo.',
      NSPhotoLibraryUsageDescription:
        'We access your photo library so you can choose a profile photo.',
      NSPhotoLibraryAddUsageDescription:
        'We may save your selected photo to your library when needed.',
      NSLocationWhenInUseUsageDescription:
        'We use your location to show nearby areas on the map and improve matching.',
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  android: {
    edgeToEdgeEnabled: true,
    package: 'io.contractspec.studio',
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#0F49A0',
    },
    softwareKeyboardLayoutMode: 'pan',
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'READ_MEDIA_IMAGES',
    ],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    bundler: 'webpack',
    output: 'static',
    favicon: './src/assets/images/favicon.png',
  },
  plugins: [
    ['expo-router'],
    'expo-localization',
    'expo-secure-store',
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '15.1',
        },
        // android: {
        //   newArchEnabled: false,
        // },
      },
    ],
    [
      'expo-splash-screen',
      {
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#0F49A0',
        image: './src/assets/images/splash.png',
        dark: {
          image: './src/assets/images/splash.png',
          backgroundColor: '#0F49A0',
        },
      },
    ],
    [
      '@maplibre/maplibre-react-native',
      {
        android: {},
        ios: {},
      },
    ],
    // [
    //   'react-native-maps',
    //   {
    //     iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    //     androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    //   },
    // ],
    [
      'expo-maps',
      {
        requestLocationPermission: true,
        locationPermission: 'Allow $(PRODUCT_NAME) to use your location',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you upload them to your profile.',
      },
    ],
    [
      'expo-calendar',
      {
        calendarPermission: 'The app needs to access your calendar.',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
        recordAudioAndroid: true,
      },
    ],
    [
      'expo-contacts',
      {
        contactsPermission: 'Allow $(PRODUCT_NAME) to access your contacts.',
      },
    ],
    [
      'expo-document-picker',
      {
        iCloudContainerEnvironment: 'Production',
      },
    ],
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: ['acct_1S3Uik5RCpNTQKYe'],
        // "enableGooglePay": true
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    websiteUrl: 'https://contractspec.io',
    eas: {
      projectId: '604780da-97f1-4f43-8a55-1d2181653e80',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/604780da-97f1-4f43-8a55-1d2181653e80',
  },
});
