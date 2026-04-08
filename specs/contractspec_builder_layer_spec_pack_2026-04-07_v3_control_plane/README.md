# ContractSpec Builder Layer Spec Pack v3

## External Engines, Mobile Parity, and Local-vs-Managed Runtime

This pack defines **Builder v3** as a governed app-authoring control plane built on top of the ContractSpec OSS foundation and Studio.

The core correction from v2 is explicit:

> **Builder is not a frontier coding agent.**  
> **Builder is a governed authoring system that delegates implementation and synthesis work to external execution providers such as Codex, Claude Code, Gemini, Copilot, STT providers, and local models.**

Builder owns:
- typed intent and source fusion,
- policy, approvals, and decision memory,
- lane orchestration,
- provider routing and fallback,
- runtime targeting,
- harness verification,
- export/readiness decisions,
- omnichannel and mobile control.

Builder does **not** try to replace:
- frontier base models,
- IDE-native coding agents,
- provider-specific coding loops.

## Key additions in v3

This revision adds the missing architecture required by the product strategy:
- explicit **external execution provider** contracts,
- explicit **provider routing** and comparison logic,
- explicit **patch proposal and execution receipt** artifacts,
- explicit **mobile parity** requirements for Telegram / WhatsApp / mobile web,
- explicit **runtime mode** support for `local`, `managed`, and `hybrid`,
- a product strategy shaped around low barrier, security, stability, ubiquity, and data integration.

## Strategic interpretation

Builder should help two user classes without becoming two incompatible products:

1. **power users / prosumers**
   - comfortable with local runtime,
   - willing to connect their own providers or data,
   - want deeper control.

2. **non-engineers / operators**
   - want managed runtime,
   - want mobile-first control,
   - want the system to handle setup, verification, and safe defaults.

The same contracts must support both.

## Layer model

1. **External execution layer**
   - Codex
   - Claude Code
   - Gemini / Gemini Code
   - Copilot / similar coding providers
   - local or hosted STT / vision / reasoning models

2. **ContractSpec OSS layer**
   - contracts
   - runtime adapters
   - harness
   - artifact generation
   - evidence and replay
   - execution lane primitives

3. **Studio layer**
   - governance
   - organization memory
   - policy
   - approvals
   - connector trust
   - export and operations

4. **Builder layer**
   - guided authoring
   - multimodal ingestion
   - provider delegation
   - mobile and omnichannel control
   - runtime target selection
   - preview and export orchestration

5. **Built app / workspace**
   - the generated artifact and runtime bundle
   - not a separate philosophical stack

## Pack contents

- `00_topology_and_positioning.md`
- `01_builder_product_strategy.md`
- `02_input_sources_and_ingestion.md`
- `03_source_fusion_and_decision_memory.md`
- `04_core_contracts.md`
- `05_authoring_lanes_and_specialized_agents.md`
- `06_external_execution_and_provider_routing.md`
- `07_mobile_parity_and_omnichannel_control.md`
- `08_runtime_modes_local_vs_managed.md`
- `09_generation_preview_export.md`
- `10_security_and_governance.md`
- `11_harness_and_readiness_gates.md`
- `12_package_strategy.md`
- `13_ui_surfaces_and_flows.md`
- `14_rollout_plan.md`
- `15_open_questions.md`
- `16_implementation_traceability.md`
- `spec-pack.manifest.json`
- `examples/`
- `package-skeleton/`

## Recommended implementation order

1. `04_core_contracts.md`
2. `06_external_execution_and_provider_routing.md`
3. `08_runtime_modes_local_vs_managed.md`
4. `02_input_sources_and_ingestion.md`
5. `03_source_fusion_and_decision_memory.md`
6. `11_harness_and_readiness_gates.md`
7. `07_mobile_parity_and_omnichannel_control.md`
8. `13_ui_surfaces_and_flows.md`

That sequence gives you the kernel first:
contracts, provider routing, runtime targeting, evidence, and mobile safety.

Everything else is garnish until those exist.
