import { notFound } from 'next/navigation';
import {
  getContractSpecFeatureRegistry,
  resolveSerializedPresentationSpec,
} from '@contractspec/bundle.library/features';
import { FeaturePresentationDetailClient } from '../../../clients';

interface PageProps {
  params: Promise<{ key: string; presKey: string }>;
}

export default async function FeaturePresentationDetailPage({
  params,
}: PageProps) {
  const { key, presKey } = await params;
  const decodedKey = decodeURIComponent(key);
  const decodedPresKey = decodeURIComponent(presKey);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    notFound();
  }

  const presentation = feature.presentations?.find(
    (p) => p.key === decodedPresKey
  );

  // Resolve and serialize the presentation spec for client component transfer
  const spec = resolveSerializedPresentationSpec(
    decodedPresKey,
    presentation?.version
  );

  return (
    <FeaturePresentationDetailClient
      feature={feature}
      presentationKey={decodedPresKey}
      presentation={presentation}
      spec={spec}
    />
  );
}
