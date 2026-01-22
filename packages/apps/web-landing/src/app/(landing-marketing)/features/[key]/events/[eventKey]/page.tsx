import { notFound } from 'next/navigation';
import { getContractSpecFeatureRegistry } from '@contractspec/bundle.library/features';
import { FeatureEventDetailClient } from '../../client';

interface PageProps {
  params: Promise<{ key: string; eventKey: string }>;
}

export default async function FeatureEventDetailPage({ params }: PageProps) {
  const { key, eventKey } = await params;
  const decodedKey = decodeURIComponent(key);
  const decodedEventKey = decodeURIComponent(eventKey);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    notFound();
  }

  const event = feature.events?.find((ev) => ev.key === decodedEventKey);

  return (
    <FeatureEventDetailClient
      feature={feature}
      eventKey={decodedEventKey}
      event={event}
    />
  );
}
