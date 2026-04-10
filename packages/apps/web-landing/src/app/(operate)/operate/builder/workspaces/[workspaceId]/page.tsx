import { notFound } from 'next/navigation';
import { BuilderWorkbenchClient } from './BuilderWorkbenchClient';
import { fetchInitialBuilderSnapshot } from './builder-workspace-data';

interface PageProps {
	params: Promise<{ workspaceId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
	const { workspaceId } = await params;
	return {
		title: `Builder Workspace ${workspaceId} | Operate`,
		description: 'Governed omnichannel Builder workbench.',
	};
}

export default async function BuilderWorkspacePage({ params }: PageProps) {
	const { workspaceId } = await params;
	if (!workspaceId) {
		notFound();
	}
	const initialSnapshot = await fetchInitialBuilderSnapshot(workspaceId);
	return <BuilderWorkbenchClient initialSnapshot={initialSnapshot} />;
}
