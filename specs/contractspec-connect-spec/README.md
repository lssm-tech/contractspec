# ContractSpec Connect Spec Package

This archive contains a technical specification for **ContractSpec Connect**, a local-first agent authority adapter for coding agents built on top of the ContractSpec OSS and Studio stack.

## Contents

- `SPEC.md` — end-to-end product and architecture specification
- `ROADMAP.md` — phased implementation roadmap
- `ARCHITECTURE.md` — runtime architecture, decision flow, and component split
- `CLI.md` — proposed CLI surface and command semantics
- `MODELS.md` — artifacts, interfaces, and example payloads
- `OSS_VS_STUDIO.md` — boundary between OSS and Studio responsibilities
- `SECURITY_AND_GOVERNANCE.md` — trust model, approvals, audit, retention, and escape hatches
- `examples/` — example config, overlay, plan packet, patch verdict, and review packet
- `schemas/` — JSON Schemas for selected artifacts
- `diagrams/` — Mermaid source for sequence and component diagrams

## Purpose

ContractSpec Connect should sit between a coding agent and any mutating action. It must:

1. Build a typed context pack from ContractSpec artifacts
2. Compile and verify a structured plan
3. Intercept risky tool calls such as file edits and shell commands
4. Return one of four outcomes:
   - `permit`
   - `rewrite`
   - `require_review`
   - `deny`
5. Persist local audit evidence and optionally bridge into Studio review flows

## Design stance

- Local-first
- OSS-useful without Studio
- Explicit contracts over inferred convention
- Versioned and reviewable canon
- Deterministic checks before trust
