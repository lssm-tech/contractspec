import { notFound } from 'next/navigation';
import { getContractSpecFeatureRegistry } from '@contractspec/bundle.library/features';
import { FeatureDataViewDetailClient } from '../../client';

interface PageProps {
  params: Promise<{ key: string; viewKey: string }>;
}

export default async function FeatureDataViewDetailPage({ params }: PageProps) {
  const { key, viewKey } = await params;
  const decodedKey = decodeURIComponent(key);
  const decodedViewKey = decodeURIComponent(viewKey);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    notFound();
  }

  const view = feature.dataViews?.find((v) => v.key === decodedViewKey);

  return (
    <FeatureDataViewDetailClient
      feature={feature}
      viewKey={decodedViewKey}
      view={view}
    />
  );
}
