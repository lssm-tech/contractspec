import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContractSpecFeatureRegistry } from '@contractspec/bundle.library/features';
import { FeatureOverviewTemplate } from '@contractspec/bundle.library/presentation/features';

interface PageProps {
  params: Promise<{ key: string }>;
}

export async function generateStaticParams() {
  const registry = getContractSpecFeatureRegistry();
  const features = registry.list();
  return features.map((f) => ({
    key: f.meta.key,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    return {
      title: 'Feature Not Found',
    };
  }

  return {
    title: `${feature.meta.title || feature.meta.key} | ContractSpec`,
    description: feature.meta.description,
  };
}

export default async function FeatureDetailPage({ params }: PageProps) {
  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const registry = getContractSpecFeatureRegistry();
  const feature = registry.get(decodedKey);

  if (!feature) {
    notFound();
  }

  return <FeatureOverviewTemplate feature={feature} />;
}
