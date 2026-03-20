import { defineDataView } from '../../data-views';
import {
	HARNESS_DOMAIN,
	HARNESS_OWNERS,
	HARNESS_STABILITY,
	HARNESS_TAGS,
} from '../constants';
import { HarnessEvaluationGetQuery } from '../queries/harnessEvaluationGet.query';

export const HarnessEvaluationsDataView = defineDataView({
	meta: {
		key: 'harness.evaluation.index',
		title: 'Harness Evaluations',
		version: '1.0.0',
		description: 'List scenario and suite evaluations.',
		domain: HARNESS_DOMAIN,
		owners: HARNESS_OWNERS,
		tags: [...HARNESS_TAGS, 'evaluation', 'index'],
		stability: HARNESS_STABILITY,
		entity: 'harness_evaluation',
	},
	source: {
		primary: {
			key: HarnessEvaluationGetQuery.meta.key,
			version: HarnessEvaluationGetQuery.meta.version,
		},
	},
	view: {
		kind: 'list',
		fields: [
			{ key: 'evaluationId', label: 'Evaluation', dataPath: 'evaluationId' },
			{ key: 'runId', label: 'Run', dataPath: 'runId' },
			{ key: 'scenarioKey', label: 'Scenario', dataPath: 'scenarioKey' },
			{ key: 'status', label: 'Status', dataPath: 'status' },
			{ key: 'evidenceCount', label: 'Evidence', dataPath: 'evidenceCount' },
		],
		primaryField: 'evaluationId',
		secondaryFields: ['scenarioKey', 'status'],
		filters: [
			{ key: 'runId', label: 'Run', field: 'runId', type: 'search' },
			{
				key: 'scenarioKey',
				label: 'Scenario',
				field: 'scenarioKey',
				type: 'search',
			},
		],
	},
	policy: {
		flags: [],
		pii: [],
	},
});
