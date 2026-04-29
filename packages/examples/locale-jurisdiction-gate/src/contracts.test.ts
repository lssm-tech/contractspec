import { describe, expect, test } from 'bun:test';
import {
	AssistantContextForm,
	AssistantGateMessagesEnGb,
	AssistantGateMessagesEnUs,
	AssistantGateMessagesFrFr,
	AssistantGatePolicy,
	LocaleJurisdictionGateFeature,
} from './index';

describe('@contractspec/example.locale-jurisdiction-gate', () => {
	test('exports the canonical policy, form, and translations', () => {
		expect(AssistantGatePolicy.meta.key).toBe(
			'locale-jurisdiction-gate.policy.gate'
		);
		expect(AssistantContextForm.meta.key).toBe(
			'locale-jurisdiction-gate.form.assistant-context'
		);
		expect(AssistantContextForm.actions?.[0]?.op?.name).toBe(
			'assistant.answer'
		);
		expect(AssistantGateMessagesEnUs.locale).toBe('en-US');
		expect(AssistantGateMessagesEnUs.meta.key).toBe(
			'locale-jurisdiction-gate.translation.assistant-gate'
		);
		expect(AssistantGateMessagesEnGb.meta.key).toBe(
			AssistantGateMessagesEnUs.meta.key
		);
		expect(AssistantGateMessagesEnGb.fallback).toBe('en-US');
		expect(AssistantGateMessagesFrFr.locale).toBe('fr-FR');
		expect(AssistantGateMessagesFrFr.meta.key).toBe(
			AssistantGateMessagesEnUs.meta.key
		);
		expect(LocaleJurisdictionGateFeature.policies).toEqual([
			{
				key: AssistantGatePolicy.meta.key,
				version: AssistantGatePolicy.meta.version,
			},
		]);
	});
});
