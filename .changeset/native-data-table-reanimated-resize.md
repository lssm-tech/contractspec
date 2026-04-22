---
"@contractspec/lib.ui-kit": patch
---

Replace the native data table resize handle's `react-native-gesture-handler` wrapper with a Reanimated responder boundary.

The data table now keeps resize delta tracking inside a `react-native-reanimated` animated view, so native UI-kit consumers no longer need `react-native-gesture-handler` for this component path.
