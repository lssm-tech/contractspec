import { notFound } from 'next/navigation';
import { getContractSpecFeatureRegistry } from '@contractspec/bundle.library/features';
import { FeaturePresentationsTemplate } from '@contractspec/bundle.library/presentation/features';

interface PageProps {
  params: Promise<{ key: string }>;
}

export default async function FeaturePresentationsPage({ params }: PageProps) {
  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    notFound();
  }

  return <FeaturePresentationsTemplate feature={feature} />;
}
