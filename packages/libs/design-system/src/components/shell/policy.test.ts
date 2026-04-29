import { describe, expect, it } from 'bun:test';
import {
	annotateShellCommandsDecisions,
	annotateShellNavigationDecisions,
} from './policy';
import type { ShellNavSection } from './types';

const sections: ShellNavSection[] = [
	{
		title: 'Workspace',
		items: [
			{ label: 'Home', href: '/home' },
			{
				label: 'Admin',
				href: '/admin',
				policy: { permissions: ['admin.access'] },
			},
			{
				label: 'Reports',
				children: [
					{
						label: 'Finance',
						href: '/reports/finance',
						policy: { permissions: ['finance.read'] },
					},
				],
			},
		],
	},
];

describe('AppShell policy helpers', () => {
	it('leaves navigation unchanged when no policy metadata exists', () => {
		const input: ShellNavSection[] = [
			{ title: 'Public', items: [{ label: 'Home', href: '/' }] },
		];
		expect(
			annotateShellNavigationDecisions(input, () => ({ effect: 'deny' }))
		).toEqual(input);
	});

	it('hides denied navigation items and prunes empty parents', () => {
		const result = annotateShellNavigationDecisions(sections, (policy) => ({
			effect: policy.permissions?.includes('finance.read') ? 'deny' : 'allow',
		}));

		expect(result[0]?.items.map((item) => item.label)).toEqual([
			'Home',
			'Admin',
		]);
	});

	it('keeps denied navigation items when policy behavior disables them', () => {
		const result = annotateShellNavigationDecisions(
			[
				{
					title: 'Workspace',
					items: [
						{
							label: 'Admin',
							href: '/admin',
							policy: { permissions: ['admin.access'] },
							policyBehavior: 'disable',
						},
					],
				},
			],
			() => ({ effect: 'deny', reason: 'missing_permission' })
		);

		expect(result[0]?.items[0]).toMatchObject({
			label: 'Admin',
			disabled: true,
			policyDecision: { effect: 'deny', reason: 'missing_permission' },
		});
	});

	it('annotates command decisions and hides denied commands when requested', () => {
		const result = annotateShellCommandsDecisions(
			[
				{
					heading: 'Actions',
					items: [
						{ id: 'open', label: 'Open' },
						{
							id: 'delete',
							label: 'Delete',
							policy: { permissions: ['delete'] },
							policyBehavior: 'hide',
						},
					],
				},
			],
			() => ({ effect: 'deny' })
		);

		expect(result[0]?.items.map((item) => item.id)).toEqual(['open']);
	});
});
