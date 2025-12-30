import TrackDetailClient from './track-detail-client';

export default async function LearningTrackDetailPage({
  params,
}: {
  params: Promise<{ trackKey: string }>;
}) {
  const { trackKey } = await params;
  return <TrackDetailClient trackKey={trackKey} />;
}
