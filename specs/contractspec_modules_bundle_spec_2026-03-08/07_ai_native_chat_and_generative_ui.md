# AI-Native Chat and Generative UI

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Goal

Define how AI participates in the surface system without bypassing the contract layer.

## Big idea

The AI is a **planner and explainer**, not the ultimate renderer.

It can:
- interpret intent
- select among declared surface variants
- ask for more context
- call tools
- propose patches
- summarize and narrate
- generate supported block content

It cannot:
- invent undeclared nodes
- bypass policy
- write raw JSX into the resolved plan
- persist changes without the runtime approval model

## Roles the assistant can play

### 1. Navigator

Helps the user get to the right surface:
- “Show me blockers”
- “Open the evidence view”
- “Focus on customer-facing bugs”

### 2. Planner

Proposes valid changes to the current surface:
- add a relation graph panel
- promote a risky action
- switch to a bottom-up evidence order
- reveal a collapsed field section

### 3. Explainer

Explains:
- why the surface changed
- what data is shown
- why something is hidden
- what the next best action is

### 4. Transformer

Creates supported content:
- rewrite an issue summary
- draft a decision brief
- create BlockNote blocks from extracted meeting actions
- produce a structured follow-up checklist

## Recommended AI SDK pattern

### Server-side

Use `streamText` or equivalent structured generation for:
- assistant response text
- tool calling
- patch proposal generation
- structured block drafts

### Client-side

Use `useChat` or equivalent for:
- thread state
- optimistic input
- message parts
- rendering assistant output
- attaching tool results and follow-up patches

## Planner output contract

The assistant should return a strongly typed structure such as:

```ts
export interface PlannerResponse {
  summary?: string;
  intent?: string;
  followUpQuestion?: string;
  toolRequests?: string[];
  patchProposals?: SurfacePatchProposal[];
  blockDrafts?: {
    slotId: string;
    blocks: unknown[];
  }[];
}
```

## Tools

The assistant should call tools that map back to declared operations or data views:
- query issue relations
- fetch saved views
- inspect field definitions
- create template
- summarize activity
- compute relation density
- fetch timeline data

The tool layer should remain auditable and use normal ContractSpec operation bindings where possible.

## Prompt design

The planner prompt should include:

- bundle metadata
- current surface metadata
- allowed slots
- allowed node kinds
- allowed patch ops
- visible actions
- current preference profile
- current plan summary
- relevant entity metadata
- safety instructions
- rejection examples

### The prompt should explicitly say

- do not emit JSX
- do not emit HTML
- do not invent node kinds
- do not call undeclared tools
- prefer fewer high-confidence patches
- explain why a patch helps the user

Because if you do not say this, the model will eventually get creative in exactly the wrong direction. Human engineering tradition continues.

## Approval model

### Low-risk auto-approval

Auto-approve only for:
- focus changes
- non-destructive slot insertions of approved helper nodes
- layout changes inside the current user session
- non-durable preference suggestions

### Explicit approval required

Require approval for:
- workspace-visible customizations
- persistent layout mutations
- action promotions that materially alter workflow
- new widgets
- cross-user changes
- destructive or hiding operations beyond session scope

## AI and overlays

When an AI proposal is accepted:
- it becomes a session patch first
- then it may be promoted to a user overlay
- then, optionally, to a workspace overlay after explicit approval

Do not let accepted AI patches jump directly to org-wide persistence.

## AI + BlockNote

BlockNote is especially valuable here because it gives the AI a supported content grammar:
- blocks
- inline content
- menus
- mentions
- AI-authored document transformations

Recommended uses:
- assistant drafts for issue summaries
- editable decision memos
- meeting extraction into structured blocks
- contextual insertion of relation or entity reference blocks

## AI + panels

The assistant may suggest workbench layout changes such as:
- “Open a relation inspector on the right”
- “Collapse guidance panel”
- “Split the main pane and show activity below”

Those become `resize-panel`, `set-layout`, `insert-node`, or `move-node` operations.

## AI + narrative and media preferences

The assistant should be aware of:
- whether the user prefers top-down or bottom-up explanations
- whether the user leans text, visual, voice, or hybrid
- how much guidance is welcome
- whether pace should be rapid or deliberate

This should affect explanations and suggestions, not policy.

## Conversation-aware surfaces

The assistant should be able to shift between:
- conversational mode
- contextual mode
- hidden/invisible mode

Examples:
- a persistent assistant rail on dense workbenches
- inline floating suggestions on rich documents
- silent background suggestions that only appear when high-confidence

## Memory

Long-lived memory should stay outside the bundle package. The bundle can consume memory-aware context through `lib.ai-agent` or another approved memory layer, but it should not become the storage engine for conversational memory.

## Guardrails

### Never
- stream partial layout mutations directly into the DOM
- allow a model to register a new widget at runtime without validation
- persist a rejected patch
- hide critical actions without traceability

### Always
- validate
- diff
- log
- allow undo
- keep a reason trail

## Minimum viable AI-native experience

A good V1 does these things well:

1. assistant understands current surface context
2. assistant can call bundle-aware tools
3. assistant can propose valid surface patches
4. user can accept/reject patches
5. accepted patches can become durable customizations
6. everything is auditable

That is enough to feel AI-native without pretending the model should own your frontend architecture.
