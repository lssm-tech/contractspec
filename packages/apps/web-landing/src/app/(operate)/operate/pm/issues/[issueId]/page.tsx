import { notFound } from 'next/navigation';
import { buildContext } from '@contractspec/lib.surface-runtime/runtime/build-context';
import { resolveBundle } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import { PmWorkbenchBundle } from '@contractspec/lib.surface-runtime/examples/pm-workbench.bundle';
import { PmWorkbenchClient } from './PmWorkbenchClient';

interface PageProps {
  params: Promise<{ issueId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { issueId } = await params;
  return {
    title: `Issue ${issueId} | PM Workbench`,
    description: 'PM issue workbench — AI-native surface',
  };
}

export default async function PmIssuePage({ params }: PageProps) {
  const { issueId } = await params;
  if (!issueId) {
    notFound();
  }

  const ctx = buildContext({
    route: `/operate/pm/issues/${issueId}`,
    params: { issueId },
    device: 'desktop',
    capabilities: ['pm.issue.view', 'pm.issue.edit'],
    entity: { type: 'pm.issue', id: issueId },
  });

  const plan = await resolveBundle(PmWorkbenchBundle, ctx);

  if (plan.surfaceId === '_error') {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-destructive">
          Failed to resolve surface. Check console for details.
        </p>
      </div>
    );
  }

  return <PmWorkbenchClient plan={plan} />;
}
