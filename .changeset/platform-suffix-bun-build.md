---
"@contractspec/tool.bun": patch
"@contractspec/lib.presentation-runtime-core": patch
---

Teach the shared Bun build tool and presentation Metro helper to support `.ios`, `.android`, `.native`, and `.web` platform variants consistently.

`contractspec-bun-build` now emits `ios` and `android` conditional exports alongside `browser` and `react-native`, builds all native-family variants into `dist/native`, and keeps exact platform subpaths exportable. The Metro helper now merges matching platform conditions so Expo and React Native resolvers can consume those package exports.
