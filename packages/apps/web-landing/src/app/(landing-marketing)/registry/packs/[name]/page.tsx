import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getPack,
  getPackReadme,
  getPackVersions,
  getPackReviews,
  getPackQuality,
} from '@/lib/registry-api';
import { PackDetailClient } from './clients/pack-detail-client';

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name } = await params;
  const pack = await getPack(name);
  if (!pack) return { title: 'Pack Not Found' };
  return {
    title: `${pack.displayName} | agentpacks Registry`,
    description: pack.description,
  };
}

export default async function PackDetailPage({ params }: PageProps) {
  const { name } = await params;
  const [pack, readme, versionsResult, reviewsResult, quality] =
    await Promise.all([
      getPack(name),
      getPackReadme(name),
      getPackVersions(name),
      getPackReviews(name, { limit: 10 }),
      getPackQuality(name),
    ]);

  if (!pack) notFound();

  return (
    <PackDetailClient
      pack={pack}
      readme={readme}
      versions={versionsResult.versions}
      reviews={reviewsResult.reviews}
      reviewTotal={reviewsResult.total}
      averageRating={reviewsResult.averageRating}
      quality={quality}
    />
  );
}
