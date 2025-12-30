import { redirect } from 'next/navigation';

export default async function StudioProjectIndexPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  redirect(`/studio/${projectSlug}/canvas`);
}
