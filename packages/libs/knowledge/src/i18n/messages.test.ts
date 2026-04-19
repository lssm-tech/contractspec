import { beforeEach, describe, expect, it } from 'bun:test';
import {
	createKnowledgeI18n,
	getDefaultI18n,
	resetI18nRegistry,
} from './messages';

describe('createKnowledgeI18n', () => {
	beforeEach(() => {
		resetI18nRegistry();
	});

	it('creates an English instance by default', () => {
		const i18n = createKnowledgeI18n();
		expect(i18n.locale).toBe('en');
		expect(i18n.t('query.noResults')).toBe('No relevant documents found.');
	});

	it('uses the provided locale or runtime locale override', () => {
		expect(createKnowledgeI18n('fr').locale).toBe('fr');
		expect(createKnowledgeI18n('fr', 'es').locale).toBe('es');
	});
});

describe('message translation', () => {
	beforeEach(() => {
		resetI18nRegistry();
	});

	it('returns English strings and interpolates placeholders', () => {
		const i18n = createKnowledgeI18n('en');

		expect(i18n.t('query.systemPrompt')).toContain('knowledge assistant');
		expect(
			i18n.t('access.notBound', {
				spaceKey: 'docs',
			})
		).toBe('Knowledge space "docs" is not bound in the resolved app config.');
		expect(
			i18n.t('access.readOnly', {
				spaceKey: 'external-kb',
				category: 'external',
			})
		).toBe(
			'Knowledge space "external-kb" is category "external" and is read-only.'
		);
		expect(
			i18n.t('query.sourceLabel', {
				index: 1,
				score: '0.950',
			})
		).toBe('Source 1 (score: 0.950):');
		expect(
			i18n.t('ingestion.gmail.from', {
				from: 'Alice <alice@example.com>',
			})
		).toBe('From: Alice <alice@example.com>');
	});

	it('keeps unmatched placeholders and unknown keys stable', () => {
		const i18n = createKnowledgeI18n('en');

		const unresolved = i18n.t('access.workflowUnauthorized', {
			workflowName: 'deploy',
		});
		expect(unresolved).toContain('deploy');
		expect(unresolved).toContain('{spaceKey}');
		expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
	});

	it('returns French strings', () => {
		const i18n = createKnowledgeI18n('fr');

		expect(i18n.t('query.noResults')).toBe(
			'Aucun document pertinent trouv\u00e9.'
		);
		expect(i18n.t('query.systemPrompt')).toContain(
			'assistant de connaissances'
		);
		expect(i18n.t('access.notBound', { spaceKey: 'docs' })).toContain('docs');
		expect(i18n.t('access.notBound', { spaceKey: 'docs' })).toContain(
			"n'est pas li\u00e9"
		);
		expect(i18n.t('ingestion.gmail.subject', { subject: 'Test' })).toBe(
			'Objet : Test'
		);
		expect(i18n.t('ingestion.gmail.from', { from: 'alice@test.com' })).toBe(
			'De : alice@test.com'
		);
	});

	it('returns Spanish strings', () => {
		const i18n = createKnowledgeI18n('es');

		expect(i18n.t('query.noResults')).toBe(
			'No se encontraron documentos relevantes.'
		);
		expect(i18n.t('query.systemPrompt')).toContain('asistente de conocimiento');
		expect(
			i18n.t('access.readOnly', {
				spaceKey: 'kb-ext',
				category: 'external',
			})
		).toContain('solo lectura');
		expect(i18n.t('ingestion.gmail.to', { to: 'bob@test.com' })).toBe(
			'Para: bob@test.com'
		);
		expect(i18n.t('ingestion.gmail.date', { date: '2025-01-01' })).toBe(
			'Fecha: 2025-01-01'
		);
	});
});

describe('getDefaultI18n', () => {
	beforeEach(() => {
		resetI18nRegistry();
	});

	it('returns the shared default English instance', () => {
		const i18n = getDefaultI18n();
		expect(i18n.locale).toBe('en');
		expect(i18n.t('query.noResults')).toBe('No relevant documents found.');
	});
});
