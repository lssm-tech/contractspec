import { redirect } from 'next/navigation';

interface InvitePageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function InvitePage(props: InvitePageProps) {
  const { invitationId } = await props.params;
  redirect(`/api/invitations/${invitationId}/accept`);
}






