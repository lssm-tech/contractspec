import { redirect } from 'next/navigation';

export default function StudioProjectIndexPage({
  params,
}: {
  params: { projectSlug: string };
}) {
  redirect(`/studio/${params.projectSlug}/canvas`);
}






