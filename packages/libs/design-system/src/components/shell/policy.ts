import type { PolicyDecision } from '@contractspec/lib.contracts-spec';
import type { PolicyRequirement } from '@contractspec/lib.contracts-spec/policy';
import type {
	ShellCommandGroup,
	ShellCommandItem,
	ShellNavItem,
	ShellNavSection,
} from './types';

export type ShellPolicyBehavior = 'hide' | 'disable' | 'show-with-lock';
export type ShellPolicyDecisionProvider<TItem> = (
	policy: PolicyRequirement,
	item: TItem
) => PolicyDecision;

export interface ShellPolicyAnnotated {
	policyDecision?: PolicyDecision;
	disabled?: boolean;
	locked?: boolean;
}

export type PolicyAwareShellNavItem = ShellNavItem & ShellPolicyAnnotated;
export type PolicyAwareShellCommandItem = ShellCommandItem &
	ShellPolicyAnnotated;

export function filterShellNavigationForPolicy(
	sections: ShellNavSection[],
	decisionProvider: ShellPolicyDecisionProvider<ShellNavItem | ShellNavSection>
): ShellNavSection[] {
	return annotateShellNavigationDecisions(sections, decisionProvider);
}

export function annotateShellNavigationDecisions(
	sections: ShellNavSection[],
	decisionProvider: ShellPolicyDecisionProvider<ShellNavItem | ShellNavSection>
): ShellNavSection[] {
	return sections.flatMap((section) => {
		const sectionDecision = section.policy
			? decisionProvider(section.policy, section)
			: undefined;
		const sectionBehavior = section.policyBehavior ?? 'hide';
		if (sectionDecision?.effect === 'deny' && sectionBehavior === 'hide') {
			return [];
		}

		const items = section.items.flatMap((item) =>
			annotateNavItem(item, decisionProvider)
		);
		if (!items.length && sectionBehavior === 'hide') return [];
		const unchanged =
			!sectionDecision &&
			items.length === section.items.length &&
			items.every((item, index) => item === section.items[index]);
		if (unchanged) return [section];
		return [
			{
				...section,
				items,
				policyDecision: sectionDecision,
				disabled:
					sectionDecision?.effect === 'deny' && sectionBehavior === 'disable',
				locked:
					sectionDecision?.effect === 'deny' &&
					sectionBehavior === 'show-with-lock',
			},
		];
	});
}

export function annotateShellCommandsDecisions(
	groups: ShellCommandGroup[],
	decisionProvider: ShellPolicyDecisionProvider<ShellCommandItem>
): ShellCommandGroup[] {
	return groups.flatMap((group) => {
		const items = group.items.flatMap((item) => {
			if (!item.policy) return [item];
			const decision = decisionProvider(item.policy, item);
			if (decision.effect === 'allow') {
				return [{ ...item, policyDecision: decision }];
			}
			const behavior = item.policyBehavior ?? 'disable';
			if (behavior === 'hide') return [];
			return [
				{
					...item,
					policyDecision: decision,
					disabled: behavior === 'disable',
					locked: behavior === 'show-with-lock',
				},
			];
		});
		return items.length ? [{ ...group, items }] : [];
	});
}

function annotateNavItem(
	item: ShellNavItem,
	decisionProvider: ShellPolicyDecisionProvider<ShellNavItem | ShellNavSection>
): ShellNavItem[] {
	const decision = item.policy
		? decisionProvider(item.policy, item)
		: undefined;
	const behavior = item.policyBehavior ?? 'hide';
	if (decision?.effect === 'deny' && behavior === 'hide') return [];
	const originalChildren = item.children;
	const children = originalChildren?.flatMap((child) =>
		annotateNavItem(child, decisionProvider)
	);
	if (
		originalChildren?.length &&
		!children?.length &&
		!item.href &&
		behavior === 'hide'
	) {
		return [];
	}
	const childrenUnchanged =
		(!originalChildren && !children) ||
		(!!children &&
			children.length === originalChildren?.length &&
			children.every((child, index) => child === originalChildren?.[index]));
	if (!decision && childrenUnchanged) return [item];
	return [
		{
			...item,
			children,
			policyDecision: decision,
			disabled: decision?.effect === 'deny' && behavior === 'disable',
			locked: decision?.effect === 'deny' && behavior === 'show-with-lock',
		},
	];
}
