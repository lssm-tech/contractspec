import TrackDetailClient from './track-detail-client';

export default function LearningTrackDetailPage({
  params,
}: {
  params: { trackKey: string };
}) {
  return <TrackDetailClient trackKey={params.trackKey} />;
}



