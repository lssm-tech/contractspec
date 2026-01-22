import { notFound } from 'next/navigation';
import { getContractSpecFeatureRegistry } from '@contractspec/bundle.library/features';
import { FeatureOperationDetailClient } from '../../client';
import { OperationSpecRegistry } from '@contractspec/lib.contracts';

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

  // Try to find the actual spec if it's a known ContractSpec operation
  const opRegistry = new OperationSpecRegistry(); // This should ideally be a global or passed in
  const spec = opRegistry.get(decodedOpKey);

  return (
    <FeatureOperationDetailClient
      feature={feature}
      operationKey={decodedOpKey}
      operation={operation}
      spec={spec}
    />
  );
}
