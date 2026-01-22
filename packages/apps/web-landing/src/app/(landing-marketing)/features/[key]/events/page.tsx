import { notFound } from 'next/navigation';
import { getContractSpecFeatureRegistry } from '@contractspec/bundle.library/features';
import { FeatureEventsTemplate } from '@contractspec/bundle.library/presentation/features';

interface PageProps {
  params: Promise<{ key: string }>;
}

export default async function FeatureEventsPage({ params }: PageProps) {
  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    notFound();
  }

  return <FeatureEventsTemplate feature={feature} />;
}
