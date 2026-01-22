import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContractSpecFeatureRegistry } from '@contractspec/bundle.library/features';
import { FeatureDetail } from '@contractspec/bundle.library/presentation/features';

interface PageProps {
  params: Promise<{ key: string }>;
}

export async function generateStaticParams() {
  const registry = getContractSpecFeatureRegistry();
  const features = registry.list();
  return features.map((feature) => ({
    key: feature.meta.key,
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
      title: 'Feature Not Found | ContractSpec',
    };
  }

  return {
    title: `${feature.meta.title} | ContractSpec Features`,
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

  // Server-side redirect for onBack is not possible in a component prop callback directly
  // handled by generic UI logic or valid link

  return (
    <div className="flex w-full justify-center px-6 py-8">
      <FeatureDetail feature={feature} className="w-full max-w-5xl" />
    </div>
  );
}
