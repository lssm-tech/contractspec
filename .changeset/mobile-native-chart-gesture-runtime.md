---
"@contractspec/lib.presentation-runtime-core": patch
"@contractspec/app.expo-demo": patch
---

Stabilize the Expo mobile visualization runtime by mapping native Metro `tslib` resolution to the ESM helper build, initializing `react-native-gesture-handler` before Expo Router, and mounting the app inside `GestureHandlerRootView`.
