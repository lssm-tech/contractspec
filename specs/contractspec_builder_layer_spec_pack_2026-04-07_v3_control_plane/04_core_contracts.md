# Core Contracts

## Proposed package anchors

- `@contractspec/lib.builder-spec`
- `@contractspec/lib.provider-spec`

These packages define the contracts Builder uses to orchestrate sources, plans, providers, runtime targets, approvals, and readiness.

---

## Core enums

### `BuilderWorkspaceStatus`
- `draft`
- `review`
- `preview_ready`
- `export_ready`
- `exported`
- `archived`

### `BuilderChannelType`
- `web_chat`
- `web_voice`
- `telegram`
- `whatsapp`
- `mobile_web`

### `BuilderSourceType`
- `web_chat_message`
- `audio_upload`
- `transcript_segment`
- `file`
- `zip_entry`
- `studio_snapshot`
- `telegram_message`
- `telegram_callback`
- `whatsapp_message`
- `whatsapp_interaction`
- `provider_output`
- `preview_evidence`

### `BuilderDirectiveType`
- `requirement`
- `constraint`
- `policy`
- `correction`
- `approval`
- `question`
- `retraction`
- `note`
- `runtime_preference`
- `provider_preference`

### `LaneType`
- `clarify`
- `consensus_plan`
- `delegate_external`
- `verify_fix`
- `preview`
- `export`

### `RiskLevel`
- `low`
- `medium`
- `high`
- `critical`

### `ApprovalStrength`
- `none`
- `weak_channel_ack`
- `bound_channel_ack`
- `studio_signed`
- `admin_signed`

### `RuntimeMode`
- `managed`
- `local`
- `hybrid`

### `ProviderKind`
- `conversational`
- `coding`
- `stt`
- `vision`
- `evaluation`
- `routing_helper`

### `ExecutionTaskType`
- `clarify`
- `summarize_sources`
- `extract_structure`
- `draft_blueprint`
- `refine_blueprint`
- `propose_patch`
- `generate_tests`
- `generate_ui_artifacts`
- `verify_output`
- `explain_diff`
- `transcribe_audio`

### `PatchProposalStatus`
- `proposed`
- `accepted_for_preview`
- `rejected`
- `superseded`
- `merged_into_blueprint`

### `RuntimeTargetType`
- `managed_workspace`
- `local_daemon`
- `local_appliance`
- `hybrid_bridge`

---

## Core entities

### `BuilderWorkspace`
Fields:
- `id`
- `tenantId`
- `name`
- `status`
- `appClass`
- `defaultRuntimeMode`
- `preferredProviderProfileId?`
- `mobileParityRequired`
- `ownerIds[]`
- `createdAt`
- `updatedAt`

### `BuilderConversation`
Fields:
- `id`
- `workspaceId`
- `primaryChannelType`
- `boundChannelIds[]`
- `activeLane`
- `status`
- `lastActivityAt`

### `BuilderParticipantBinding`
Fields:
- `id`
- `workspaceId`
- `participantId`
- `channelType`
- `externalIdentityRef`
- `identityAssurance`
- `allowedActions[]`
- `approvalStrength`
- `createdAt`
- `revokedAt?`

### `BuilderSourceRecord`
Fields:
- `id`
- `workspaceId`
- `conversationId?`
- `sourceType`
- `channelType?`
- `title`
- `hash`
- `provenance`
- `policyClassification`
- `approvalState`
- `runtimeScope?`
- `supersedesSourceId?`
- `deletedAt?`

### `BuilderDirectiveCandidate`
Fields:
- `id`
- `workspaceId`
- `sourceIds[]`
- `directiveType`
- `statement`
- `targetArea`
- `confidence`
- `requiresReview`
- `status`

### `BuilderBlueprint`
Fields:
- `id`
- `workspaceId`
- `appBrief`
- `personas[]`
- `domainObjects[]`
- `workflows[]`
- `surfaces[]`
- `integrations[]`
- `policies[]`
- `runtimeProfiles[]`
- `channelSurfaces[]`
- `assumptions[]`
- `openQuestions[]`
- `version`

### `BuilderPlan`
Fields:
- `id`
- `workspaceId`
- `laneType`
- `runtimeMode`
- `steps[]`
- `providerSelections[]`
- `policyVerdicts[]`
- `requiresApproval`
- `traceId`

### `RuntimeTarget`
Fields:
- `id`
- `workspaceId`
- `type`
- `runtimeMode`
- `displayName`
- `registrationState`
- `capabilityProfile`
- `networkPolicy`
- `dataLocality`
- `secretHandlingMode`
- `lastSeenAt?`

### `ExternalExecutionProvider`
Fields:
- `id`
- `providerKind`
- `displayName`
- `integrationPackage`
- `authMode`
- `capabilityProfile`
- `supportedRuntimeModes[]`
- `supportedTaskTypes[]`
- `defaultRiskPolicy`
- `status`

### `ProviderCapabilityProfile`
Fields:
- `providerId`
- `supportsRepoScopedPatch`
- `supportsStructuredDiff`
- `supportsLongContext`
- `supportsFunctionCalling`
- `supportsSTT`
- `supportsVision`
- `supportsStreaming`
- `supportsLocalExecution`
- `supportedArtifactTypes[]`
- `knownConstraints[]`

### `ExternalExecutionContextBundle`
Fields:
- `id`
- `workspaceId`
- `taskType`
- `blueprintRef`
- `sourceRefs[]`
- `policyRefs[]`
- `allowedWriteScopes[]`
- `runtimeTargetRef?`
- `acceptanceCriteria[]`
- `hash`

### `ExternalExecutionRun`
Fields:
- `id`
- `workspaceId`
- `providerId`
- `taskType`
- `runtimeMode`
- `runtimeTargetId?`
- `contextBundleId`
- `requestedModel?`
- `status`
- `startedAt`
- `finishedAt?`
- `costEstimate?`
- `tokenUsage?`
- `artifactRefs[]`
- `patchProposalIds[]`
- `receiptId`

### `ExternalPatchProposal`
Fields:
- `id`
- `workspaceId`
- `runId`
- `summary`
- `changedAreas[]`
- `artifactRefs[]`
- `diffHash`
- `riskLevel`
- `verificationRequirements[]`
- `status`

### `ExternalArtifactReceipt`
Fields:
- `id`
- `runId`
- `providerId`
- `providerRunRef?`
- `inputContextHash`
- `outputArtifactHashes[]`
- `modelVersion?`
- `runtimeMode`
- `runtimeTargetId?`
- `generatedAt`
- `integrityChecks[]`

### `ProviderRoutingPolicy`
Fields:
- `id`
- `workspaceId?`
- `taskRules[]`
- `riskRules[]`
- `runtimeModeRules[]`
- `fallbackRules[]`
- `comparisonRules[]`
- `defaultProviderProfileId`

### `BuilderApprovalTicket`
Fields:
- `id`
- `workspaceId`
- `reason`
- `riskLevel`
- `requestedVia`
- `requiredStrength`
- `status`
- `expiresAt?`

### `MobileReviewSession`
Fields:
- `id`
- `workspaceId`
- `channelType`
- `deepLinkRef?`
- `reviewSubjectType`
- `reviewSubjectId`
- `expiresAt`
- `status`

### `BuilderReadinessReport`
Fields:
- `id`
- `workspaceId`
- `overallStatus`
- `supportedRuntimeModes[]`
- `channelParityStatus`
- `blockingIssues[]`
- `warnings[]`
- `harnessRunRefs[]`
- `recommendedNextAction`

---

## Required invariants

1. No provider output can become final blueprint truth without reconciliation.
2. No high-risk mutation can bypass approval policy because it came from Telegram, WhatsApp, or voice.
3. The same blueprint must be exportable to managed or local targets when marked compatible.
4. Mobile parity is a workspace-level requirement, not a UX afterthought.
5. Every external execution run must produce a receipt.
