import type { CapabilityRegistry } from '../capabilities';
import type { DataViewRegistry } from '../data-views/registry';
import type { FormRegistry } from '../forms/forms';
import type { IntegrationSpecRegistry } from '@contractspec/lib.contracts-integrations';
import type { JobSpecRegistry } from '../jobs/spec';
import type { KnowledgeSpaceRegistry } from '../knowledge/spec';
import type { PolicyRegistry } from '../policy/registry';
import type { PresentationSpec } from '../presentations/presentations';
import type { TelemetryRegistry } from '../telemetry/spec';
import type { TranslationRegistry } from '../translations/registry';
import type { VisualizationRegistry } from '../visualizations/registry';
import type { WorkflowRegistry } from '../workflow/spec';
import type { FeatureRegistry } from './registry';
import type { FeatureModuleSpec } from './types';

/** Dependencies for installing a feature. */
export interface InstallFeatureDeps {
	features: FeatureRegistry;
	ops?: import('../operations/registry').OperationSpecRegistry;
	presentations?: import('../presentations').PresentationRegistry;
	descriptors?: PresentationSpec[];
	capabilities?: CapabilityRegistry;
	workflows?: WorkflowRegistry;
	knowledge?: KnowledgeSpaceRegistry;
	telemetry?: TelemetryRegistry;
	policies?: PolicyRegistry;
	integrations?: IntegrationSpecRegistry;
	jobs?: JobSpecRegistry;
	translations?: TranslationRegistry;
	dataViews?: DataViewRegistry;
	visualizations?: VisualizationRegistry;
	forms?: FormRegistry;
}

/** Validate and register a feature against optional registries/descriptors. */
export function installFeature(
	feature: FeatureModuleSpec,
	deps: InstallFeatureDeps
) {
	// Validate referenced ops exist if registry provided
	if (deps.ops && feature.operations) {
		for (const o of feature.operations) {
			const s = deps.ops.get(o.key, o.version);
			if (!s)
				throw new Error(
					`installFeature: operation not found ${o.key}.v${o.version}`
				);
		}
	}
	// Validate referenced presentations exist if registry provided
	if (deps.presentations && feature.presentations) {
		for (const p of feature.presentations) {
			const pres = deps.presentations.get(p.key, p.version);
			if (!pres)
				throw new Error(
					`installFeature: presentation not found ${p.key}.v${p.version}`
				);
		}
	}
	// Validate V2 target requirements if provided
	if (feature.presentationsTargets && deps.descriptors) {
		for (const req of feature.presentationsTargets) {
			const d = deps.descriptors.find(
				(x) => x.meta.key === req.key && x.meta.version === req.version
			);
			if (!d)
				throw new Error(
					`installFeature: V2 descriptor not found ${req.key}.v${req.version}`
				);
			for (const t of req.targets) {
				if (!d.targets.includes(t))
					throw new Error(
						`installFeature: descriptor ${req.key}.v${req.version} missing target ${t}`
					);
			}
		}
	}
	// Validate op→presentation links
	if (feature.opToPresentation && feature.opToPresentation.length > 0) {
		for (const link of feature.opToPresentation) {
			if (deps.ops) {
				const s = deps.ops.get(link.op.key, link.op.version);
				if (!s)
					throw new Error(
						`installFeature: linked op not found ${link.op.key}.v${link.op.version}`
					);
			}
			if (deps.presentations) {
				const pres = deps.presentations.get(link.pres.key, link.pres.version);
				if (!pres)
					throw new Error(
						`installFeature: linked presentation not found ${link.pres.key}.v${link.pres.version}`
					);
			}
		}
	}
	// Validate capability bindings when registry provided
	if (deps.capabilities && feature.capabilities?.provides) {
		for (const cap of feature.capabilities.provides) {
			const spec = deps.capabilities.get(cap.key, cap.version);
			if (!spec)
				throw new Error(
					`installFeature: capability not registered ${cap.key}.v${cap.version}`
				);
		}
	}
	if (feature.capabilities?.requires?.length) {
		if (!deps.capabilities)
			throw new Error(
				`installFeature: capability registry required to validate capability requirements for ${feature.meta.key}`
			);
		const provided = feature.capabilities.provides ?? [];
		for (const req of feature.capabilities.requires) {
			const satisfied = deps.capabilities.satisfies(req, provided);
			if (!satisfied)
				throw new Error(
					`installFeature: capability requirement not satisfied ${req.key}${req.version ? `.v${req.version}` : ''}`
				);
		}
	}
	if (deps.dataViews && feature.dataViews) {
		for (const dv of feature.dataViews) {
			const spec = deps.dataViews.get(dv.key, dv.version);
			if (!spec)
				throw new Error(
					`installFeature: data view not found ${dv.key}.v${dv.version}`
				);
		}
	}
	if (deps.visualizations && feature.visualizations) {
		for (const visualization of feature.visualizations) {
			const spec = deps.visualizations.get(
				visualization.key,
				visualization.version
			);
			if (!spec)
				throw new Error(
					`installFeature: visualization not found ${visualization.key}.v${visualization.version}`
				);
		}
	}
	if (deps.forms && feature.forms) {
		for (const f of feature.forms) {
			const spec = deps.forms.get(f.key, f.version);
			if (!spec)
				throw new Error(
					`installFeature: form not found ${f.key}.v${f.version}`
				);
		}
	}
	if (deps.workflows && feature.workflows) {
		for (const w of feature.workflows) {
			const spec = deps.workflows.get(w.key, w.version);
			if (!spec)
				throw new Error(
					`installFeature: workflow not found ${w.key}.v${w.version}`
				);
		}
	}
	if (deps.knowledge && feature.knowledge) {
		for (const k of feature.knowledge) {
			const spec = deps.knowledge.get(k.key, k.version);
			if (!spec)
				throw new Error(
					`installFeature: knowledge space not found ${k.key}.v${k.version}`
				);
		}
	}
	if (deps.telemetry && feature.telemetry) {
		for (const t of feature.telemetry) {
			const spec = deps.telemetry.get(t.key, t.version);
			if (!spec)
				throw new Error(
					`installFeature: telemetry spec not found ${t.key}.v${t.version}`
				);
		}
	}
	if (deps.policies && feature.policies) {
		for (const p of feature.policies) {
			const spec = deps.policies.get(p.key, p.version);
			if (!spec)
				throw new Error(
					`installFeature: policy not found ${p.key}.v${p.version}`
				);
		}
	}
	if (deps.integrations && feature.integrations) {
		for (const i of feature.integrations) {
			const spec = deps.integrations.get(i.key, i.version);
			if (!spec)
				throw new Error(
					`installFeature: integration not found ${i.key}.v${i.version}`
				);
		}
	}
	if (deps.jobs && feature.jobs) {
		for (const j of feature.jobs) {
			const spec = deps.jobs.get(j.key, j.version);
			if (!spec)
				throw new Error(`installFeature: job not found ${j.key}.v${j.version}`);
		}
	}
	if (deps.translations && feature.translations) {
		for (const t of feature.translations) {
			const locales = deps.translations.listLocales(t.key);
			if (locales.length === 0)
				throw new Error(
					`installFeature: translation not found ${t.key}.v${t.version}`
				);
			if (t.locale && !locales.includes(t.locale))
				throw new Error(
					`installFeature: translation locale ${t.locale} not found for ${t.key}.v${t.version}`
				);
		}
	}
	deps.features.register(feature);
	return deps.features;
}
