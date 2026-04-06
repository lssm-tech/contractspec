# @contractspec/module.execution-console

Website: https://contractspec.io

Operator-facing execution lane console components and helpers built on top of `@contractspec/lib.execution-lanes`.

## What It Provides

- Presentation components for lane status, timelines, team worker views, completion views, and evidence browsing.
- A read-only command reference component that surfaces the typed `/clarify`, `/plan`, `/plan --consensus`, `/complete`, and `/team` semantics from `@contractspec/lib.execution-lanes/interop`.
- Small core helpers that turn lane snapshots into UI-friendly timeline items.
- A light presentation-state hook for tabs and evidence selection.

## Public Entry Points

- `.` resolves through `./src/index.ts`
- `./core` resolves through `./src/core/index.ts`
- `./presentation` resolves through `./src/presentation/index.ts`
- `./presentation/components` resolves through `./src/presentation/components/index.ts`
- `./presentation/hooks` resolves through `./src/presentation/hooks/index.ts`
