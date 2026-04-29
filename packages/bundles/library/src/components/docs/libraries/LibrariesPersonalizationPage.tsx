import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import {
	Code,
	H1,
	H2,
	P,
	Text,
} from '@contractspec/lib.design-system/typography';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const DATA_VIEW_PREFERENCE_EXAMPLE = `import { DataViewRenderer } from '@contractspec/lib.design-system';
import { resolveDataViewPreferences } from '@contractspec/lib.personalization/data-view-preferences';

const resolved = resolveDataViewPreferences({
  spec: AccountsDataView,
  preferences: profile.canonical,
  insights,
  record: savedAccountViewPreference,
});

return (
  <DataViewRenderer
    spec={AccountsDataView}
    items={accounts}
    defaultViewMode={resolved.viewMode}
    defaultDensity={resolved.density}
    defaultDataDepth={resolved.dataDepth}
    pagination={{
      page,
      pageSize: resolved.pageSize ?? 25,
      total,
    }}
  />
);`;

const DATA_VIEW_TRACKING_EXAMPLE = `tracker.trackDataViewInteraction({
  dataViewKey: AccountsDataView.meta.key,
  dataViewVersion: AccountsDataView.meta.version,
  action: 'view_mode_changed',
  viewMode: 'grid',
});

tracker.trackDataViewInteraction({
  dataViewKey: AccountsDataView.meta.key,
  action: 'data_depth_changed',
  dataDepth: 'detailed',
});

tracker.trackDataViewInteraction({
  dataViewKey: AccountsDataView.meta.key,
  action: 'filter_changed',
  filterKey: 'status',
});`;

const DATA_VIEW_PERSONALIZATION_PROMPT = `Add DataView personalization for <screen>.

Acceptance criteria:
- Resolve viewMode, density, dataDepth, and pageSize with resolveDataViewPreferences.
- Apply resolved values to DataViewRenderer as default or controlled props.
- Track opened, view_mode_changed, density_changed, data_depth_changed, search_changed, filter_changed, sort_changed, and page_changed actions with trackDataViewInteraction.
- Persist only the dimensions allowed by view.collection.personalization.persist.
- Ignore behavior-derived modes that are not allowed by view.collection.viewModes.allowedModes.
- Do not import React or design-system code into @contractspec/lib.personalization helpers.`;

export function LibrariesPersonalizationPage() {
	return (
		<VStack className="space-y-8">
			<VStack className="space-y-4">
				<H1 className="font-bold text-4xl">
					@contractspec/lib.personalization
				</H1>
				<P className="text-lg text-muted-foreground">
					Track field/feature/workflow usage, analyze drop-offs, and convert
					insights into OverlaySpecs or workflow tweaks.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Installation</H2>
				<InstallCommand package="@contractspec/lib.personalization" />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Tracker</H2>
				<P className="text-muted-foreground">
					Buffer events per tenant/user and emit OpenTelemetry counters
					automatically.
				</P>
				<CodeBlock
					language="typescript"
					code={`import { createBehaviorTracker } from '@contractspec/lib.personalization';

const tracker = createBehaviorTracker({
  store,
  context: { tenantId: ctx.tenant.id, userId: ctx.identity.id },
});

tracker.trackFieldAccess({ operation: 'billing.createOrder', field: 'items' });
tracker.trackWorkflowStep({ workflow: 'invoice', step: 'review', status: 'entered' });`}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">DataView Preferences</H2>
				<P className="text-muted-foreground">
					Use <Code>resolveDataViewPreferences</Code> when a collection DataView
					should honor a user's preferred list/grid/table mode, compact or
					comfortable density, data depth, and page size. The helper returns
					plain values that can be passed into the renderer without coupling the
					design-system package to personalization. Start from the{' '}
					<Link
						href="/docs/libraries/data-views"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						<Text>DataViews runtime guide</Text>
					</Link>{' '}
					when you need the contract and renderer shape.
				</P>
				<CodeBlock language="tsx" code={DATA_VIEW_PREFERENCE_EXAMPLE} />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">DataView Interaction Events</H2>
				<P className="text-muted-foreground">
					Track <Code>data_view_interaction</Code> events for view mode,
					density, data depth, search, filters, sorting, and pagination. The
					in-memory store summarizes those events, and the analyzer can derive a
					scoped preferred collection mode from valid interaction counts.
				</P>
				<CodeBlock language="typescript" code={DATA_VIEW_TRACKING_EXAMPLE} />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Analyzer</H2>
				<P className="text-muted-foreground">
					Summarize events and highlight unused UI, frequent fields, and
					workflow bottlenecks.
				</P>
				<CodeBlock
					language="typescript"
					code={`import { BehaviorAnalyzer } from '@contractspec/lib.personalization/analyzer';

const analyzer = new BehaviorAnalyzer(store);
const insights = await analyzer.analyze({ tenantId: 'acme', userId: 'ops-42' });
// {
//   unusedFields: ['internalNotes'],
//   workflowBottlenecks: [...],
//   dataViewPreferences: {
//     'crm.accounts': { preferredViewMode: 'grid' }
//   }
// }`}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Adapter</H2>
				<P className="text-muted-foreground">
					Convert insights into overlays or workflow extension hints.
				</P>
				<CodeBlock
					language="typescript"
					code={`import { insightsToOverlaySuggestion } from '@contractspec/lib.personalization/adapter';

const overlay = insightsToOverlaySuggestion(insights, {
  overlayId: 'acme-order-form',
  tenantId: 'acme',
  capability: 'billing.createOrder',
});`}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Agent Prompt</H2>
				<P className="text-muted-foreground">
					Use this when asking an agent to wire DataView preferences while
					preserving the personalization/design-system boundary.
				</P>
				<CodeBlock
					language="markdown"
					code={DATA_VIEW_PERSONALIZATION_PROMPT}
				/>
			</VStack>

			<HStack className="items-center gap-4 pt-4">
				<Link href="/docs/libraries" className="btn-ghost">
					<Text>Back to Libraries</Text>
				</Link>
				<Link href="/docs/libraries/overlay-engine" className="btn-primary">
					<Text>Next: Overlay Engine</Text> <ChevronRight size={16} />
				</Link>
			</HStack>
		</VStack>
	);
}
