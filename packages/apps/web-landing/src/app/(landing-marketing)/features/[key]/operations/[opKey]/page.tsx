import { notFound } from 'next/navigation';
import {
  getContractSpecFeatureRegistry,
  resolveSerializedOperationSpec,
} from '@contractspec/bundle.library/features';
import { FeatureOperationDetailClient } from '../../../client';

interface PageProps {
  params: Promise<{ key: string; opKey: string }>;
}

export default async function FeatureOperationDetailPage({
  params,
}: PageProps) {
  const { key, opKey } = await params;
  const decodedKey = decodeURIComponent(key);
  const decodedOpKey = decodeURIComponent(opKey);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    notFound();
  }

  const operation = feature.operations?.find((op) => op.key === decodedOpKey);

  // Resolve and serialize the operation spec for client component transfer
  const spec = resolveSerializedOperationSpec(decodedOpKey, operation?.version);

  return (
    <FeatureOperationDetailClient
      feature={feature}
      operationKey={decodedOpKey}
      operation={operation}
      spec={spec}
    />
  );
}
