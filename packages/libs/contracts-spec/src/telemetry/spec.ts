import type { DocBlock } from '../docs/types';
import type { EventKey } from '../events';
import type { OwnerShipMeta } from '../ownership';
export type TelemetryPrivacyLevel = 'public' | 'internal' | 'pii' | 'sensitive';

export type TelemetryMeta = OwnerShipMeta;

export interface TelemetryPropertyDef {
	type: 'string' | 'number' | 'boolean' | 'timestamp' | 'json';
	required?: boolean;
	pii?: boolean;
	redact?: boolean;
	description?: string;
}

export interface TelemetryAnomalyThreshold {
	metric: string;
	min?: number;
	max?: number;
}

export type TelemetryAnomalyAction = 'alert' | 'log' | 'trigger_regen';

export interface TelemetryAnomalyDetectionConfig {
	enabled: boolean;
	thresholds?: TelemetryAnomalyThreshold[];
	actions?: TelemetryAnomalyAction[];
	/**
	 * Minimum sample size before evaluating thresholds.
	 * Helps avoid false positives on small sample sizes.
	 */
	minimumSample?: number;
}

export interface TelemetrySamplingConfig {
	rate: number;
	conditions?: string[];
}

export interface TelemetryRetentionConfig {
	days: number;
	policy?: 'archive' | 'delete';
}

export interface TelemetryEventDef {
	/** Name of the event (should match EventSpec.key for cross-reference). */
	key: string;
	/** Version of the underlying event. */
	version: string;
	/** High-level semantics for docs/analyzers. */
	semantics: {
		who?: string;
		what: string;
		why?: string;
	};
	/** Detailed property metadata keyed by property name. */
	properties: Record<string, TelemetryPropertyDef>;
	/** Privacy level for the entire event. */
	privacy: TelemetryPrivacyLevel;
	/** Retention policy overrides. */
	retention?: TelemetryRetentionConfig;
	/** Sampling rules, defaulting to spec.config defaults. */
	sampling?: TelemetrySamplingConfig;
	/** Anomaly detection overrides. */
	anomalyDetection?: TelemetryAnomalyDetectionConfig;
	/** Optional tags for analytics/AI hints. */
	tags?: string[];
}

export interface TelemetryProviderConfig {
	type: 'posthog' | 'segment' | 'opentelemetry' | 'internal';
	config: Record<string, unknown>;
}

export interface TelemetryConfig {
	defaultRetentionDays?: number;
	defaultSamplingRate?: number;
	providers?: TelemetryProviderConfig[];
	anomalyDetection?: {
		enabled: boolean;
		checkIntervalMs?: number;
	};
}

export interface TelemetrySpec {
	meta: TelemetryMeta;
	events: TelemetryEventDef[];
	config?: TelemetryConfig;
}

const telemetryKey = (meta: TelemetryMeta) => `${meta.key}.v${meta.version}`;

import { compareVersions } from 'compare-versions';
import { SpecContractRegistry } from '../registry';

// ...

export class TelemetryRegistry extends SpecContractRegistry<
	'telemetry',
	TelemetrySpec
> {
	private readonly eventsByKey = new Map<EventKey, TelemetryEventDef>();
	private readonly specByEventKey = new Map<EventKey, TelemetrySpec>();

	constructor(items?: TelemetrySpec[]) {
		super('telemetry', items);
		if (items) {
			items.forEach((spec) => this.indexEvents(spec));
		}
	}

	// Override register to index events
	register(spec: TelemetrySpec): this {
		super.register(spec);
		this.indexEvents(spec);
		return this;
	}

	private indexEvents(spec: TelemetrySpec) {
		for (const event of spec.events) {
			this.eventsByKey.set(`${event.key}.v${event.version}`, event);
			this.specByEventKey.set(`${event.key}.v${event.version}`, spec);
		}
	}

	findEventDef(name: string, version?: string): TelemetryEventDef | undefined {
		if (version != null) {
			return this.eventsByKey.get(`${name}.v${version}`);
		}
		let latest: TelemetryEventDef | undefined;
		for (const event of this.eventsByKey.values()) {
			if (event.key !== name) continue;
			if (!latest || compareVersions(event.version, latest.version) > 0) {
				latest = event;
			}
		}
		return latest;
	}

	getSpecForEvent(name: string, version: string): TelemetrySpec | undefined {
		return this.specByEventKey.get(`${name}.v${version}`);
	}
}

export function makeTelemetryKey(meta: TelemetryMeta) {
	return telemetryKey(meta);
}

export const tech_contracts_telemetry_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.telemetry',
		title: 'TelemetrySpec',
		summary:
			'Telemetry specs describe product analytics in a durable, type-safe way. They reference existing `EventSpec`s (same name/version) but layer on privacy classification, retention, sampling, and anomaly detection so instrumentation stays compliant and observable.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/telemetry',
		tags: ['tech', 'contracts', 'telemetry'],
		body: "## TelemetrySpec\n\nTelemetry specs describe product analytics in a durable, type-safe way. They reference existing `EventSpec`s (same name/version) but layer on privacy classification, retention, sampling, and anomaly detection so instrumentation stays compliant and observable.\n\n- **File location**: `packages/libs/contracts/src/telemetry/spec.ts`\n- **Runtime tracker**: `packages/libs/contracts/src/telemetry/tracker.ts`\n- **Anomaly monitor**: `packages/libs/contracts/src/telemetry/anomaly.ts`\n\n### Core concepts\n\n```ts\nexport interface TelemetrySpec {\n  meta: TelemetryMeta;\n  events: TelemetryEventDef[];\n  config?: TelemetryConfig;\n}\n```\n\n- `meta`: ownership + identifiers (`name`, `version`, `domain`)\n- `events`: per-event semantics, property definitions, privacy level, retention, sampling, anomaly rules\n- `config`: defaults and provider configuration\n- `TelemetryRegistry`: registers specs, resolves latest version, finds event definitions by name/version\n\n### An example\n\n```ts\nexport const SigilTelemetry: TelemetrySpec = {\n  meta: {\n    name: 'sigil.telemetry',\n    version: '1.0.0',\n    title: 'Sigil telemetry',\n    description: 'Core Sigil product telemetry',\n    domain: 'sigil',\n    owners: ['@team.analytics'],\n    tags: ['telemetry'],\n    stability: StabilityEnum.Experimental,\n  },\n  config: {\n    defaultRetentionDays: 30,\n    defaultSamplingRate: 1,\n    providers: [\n      { type: 'posthog', config: { projectApiKey: process.env.POSTHOG_KEY } },\n    ],\n  },\n  events: [\n    {\n      name: 'sigil.telemetry.workflow_step',\n      version: '1.0.0',\n      semantics: {\n        what: 'Workflow step executed',\n        who: 'Actor executing the workflow',\n      },\n      privacy: 'internal',\n      properties: {\n        workflow: { type: 'string', required: true },\n        step: { type: 'string', required: true },\n        durationMs: { type: 'number' },\n        userId: { type: 'string', pii: true, redact: true },\n      },\n      anomalyDetection: {\n        enabled: true,\n        minimumSample: 10,\n        thresholds: [\n          { metric: 'durationMs', max: 1500 },\n        ],\n        actions: ['alert', 'trigger_regen'],\n      },\n    },\n  ],\n};\n```\n\n### Tracking events at runtime\n\n`TelemetryTracker` performs sampling, PII redaction, provider dispatch, and anomaly detection.\n\n```ts\nconst tracker = new TelemetryTracker({\n  registry: telemetryRegistry,\n  providers: [\n    {\n      id: 'posthog',\n      async send(dispatch) {\n        posthog.capture({\n          event: dispatch.name,\n          properties: dispatch.properties,\n          distinctId: dispatch.context.userId ?? dispatch.context.sessionId,\n        });\n      },\n    },\n  ],\n  anomalyMonitor: new TelemetryAnomalyMonitor({\n    onAnomaly(event) {\n      console.warn('Telemetry anomaly detected', event);\n    },\n  }),\n});\n\nawait tracker.track('sigil.telemetry.workflow_step', 1, {\n  workflow: 'onboarding',\n  step: 'verify_email',\n  durationMs: 2100,\n  userId: 'user-123',\n});\n```\n\n- Sampling obeys the event-specific rate (fallback to spec defaults)\n- Properties flagged with `pii` or `redact` are masked before dispatch\n- Anomaly monitor evaluates thresholds and triggers actions (e.g., log, alert, regeneration)\n\n### Spec integration\n\n- `ContractSpec.telemetry` allows operations to emit success/failure events automatically\n- `OperationSpecRegistry.execute()` uses the tracker when `ctx.telemetry` is provided\n- `WorkflowRunner` (Phase 4 follow-up) will emit telemetry during step transitions\n- `TelemetrySpec` events should reuse `EventSpec` names/versions to keep analytics/contract parity\n\n### CLI workflow\n\n```\ncontracts-cli create telemetry\n```\n\n- Interactive wizard prompts for meta, providers, events, properties, retention, anomaly rules\n- Output: `*.telemetry.ts` file using `TelemetrySpec`\n\n### Best practices\n\n- Prefer `internal` privacy for non-PII; mark PII properties explicitly with `pii` + `redact`\n- Keep sampling \u22650.05 except for high-volume events\n- Configure anomaly detection on key metrics (duration, error count, conversion)\n- Check telemetry into source control alongside contracts; regenerate via CLI when specs change\n\n### Next steps\n\n- Phase 5: Regenerator monitors telemetry anomalies to propose spec improvements\n- Phase 6: Studio surfaces telemetry controls per tenant via `TenantAppConfig`\n\n",
	},
];
