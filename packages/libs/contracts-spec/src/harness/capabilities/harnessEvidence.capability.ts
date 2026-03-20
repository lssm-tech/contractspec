import { defineCapability } from '../../capabilities';
import {
	HARNESS_DOMAIN,
	HARNESS_OWNERS,
	HARNESS_STABILITY,
	HARNESS_TAGS,
} from '../constants';

export const HarnessEvidenceCapability = defineCapability({
	meta: {
		key: 'harness.evidence',
		version: '1.0.0',
		kind: 'data',
		title: 'Harness Evidence',
		description: 'Capture and retrieve normalized evidence artifacts.',
		domain: HARNESS_DOMAIN,
		owners: HARNESS_OWNERS,
		tags: [...HARNESS_TAGS, 'evidence'],
		stability: HARNESS_STABILITY,
	},
	provides: [
		{
			surface: 'operation',
			key: 'harness.evidence.list',
			version: '1.0.0',
			description: 'List evidence for a run.',
		},
		{
			surface: 'operation',
			key: 'harness.evidence.get',
			version: '1.0.0',
			description: 'Read one evidence artifact.',
		},
		{
			surface: 'event',
			key: 'harness.evidence.captured',
			version: '1.0.0',
			description: 'Evidence captured during execution.',
		},
		{
			surface: 'presentation',
			key: 'harness.run.audit',
			version: '1.0.0',
			description: 'Audit presentation for harness runs and evidence.',
		},
	],
});
