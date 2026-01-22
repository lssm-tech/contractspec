import { notFound } from 'next/navigation';
import {
  getContractSpecFeatureRegistry,
  resolveSerializedFormSpec,
} from '@contractspec/bundle.library/features';
import { FeatureFormDetailClient } from '../../../client';

interface PageProps {
  params: Promise<{ key: string; formKey: string }>;
}

export default async function FeatureFormDetailPage({ params }: PageProps) {
  const { key, formKey } = await params;
  const decodedKey = decodeURIComponent(key);
  const decodedFormKey = decodeURIComponent(formKey);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    notFound();
  }

  const form = feature.forms?.find((f) => f.key === decodedFormKey);

  // Resolve and serialize the form spec for client component transfer
  const spec = resolveSerializedFormSpec(decodedFormKey, form?.version);

  return (
    <FeatureFormDetailClient
      feature={feature}
      formKey={decodedFormKey}
      form={form}
      spec={spec}
    />
  );
}
