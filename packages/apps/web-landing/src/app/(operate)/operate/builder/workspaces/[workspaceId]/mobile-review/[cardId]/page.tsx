import { fetchInitialBuilderSnapshot } from '../../builder-workspace-data';
import { BuilderMobileReviewClient } from './BuilderMobileReviewClient';

interface MobileReviewPageProps {
	params: Promise<{ workspaceId: string; cardId: string }>;
}

export async function generateMetadata({ params }: MobileReviewPageProps) {
	const { workspaceId, cardId } = await params;
	return {
		title: `Builder Review ${cardId} | ${workspaceId}`,
		description: 'Mobile review surface for Builder change cards.',
	};
}

export default async function BuilderMobileReviewPage({
	params,
}: MobileReviewPageProps) {
	const { workspaceId, cardId } = await params;
	if (!workspaceId || !cardId) {
		await abortNotFound();
	}
	const initialSnapshot = await fetchInitialBuilderSnapshot(workspaceId);
	return (
		<BuilderMobileReviewClient
			initialSnapshot={initialSnapshot}
			cardId={cardId}
		/>
	);
}

async function abortNotFound(): Promise<never> {
	const { notFound } = await import('next/navigation');
	return notFound();
}
