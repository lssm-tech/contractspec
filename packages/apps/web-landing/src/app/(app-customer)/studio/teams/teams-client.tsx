'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Input } from '@lssm/lib.design-system';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';
import {
  useCreateTeam,
  useDeleteTeam,
  useInviteToOrganization,
  useMyTeams,
  useOrganizationInvitations,
  useRenameTeam,
} from '@lssm/bundle.contractspec-studio/presentation/hooks/studio';

type InviteRole = 'member' | 'admin';

export default function TeamsClient() {
  const { data: teamsData, isLoading: teamsLoading, refetch: refetchTeams } =
    useMyTeams({ enabled: true });
  const teams = teamsData?.myTeams ?? [];

  const {
    data: invitesData,
    isLoading: invitesLoading,
    refetch: refetchInvites,
    error: invitesError,
  } = useOrganizationInvitations({ enabled: true });
  const invitations = invitesData?.organizationInvitations ?? [];

  const createTeam = useCreateTeam();
  const renameTeam = useRenameTeam();
  const deleteTeam = useDeleteTeam();
  const inviteToOrg = useInviteToOrganization();

  const [newTeamName, setNewTeamName] = React.useState('');
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState<InviteRole>('member');
  const [inviteTeamId, setInviteTeamId] = React.useState<string>('__none__');

  const [renameDraft, setRenameDraft] = React.useState<Record<string, string>>(
    {}
  );

  const fullInviteLink = (inviteUrl: string) => {
    if (inviteUrl.startsWith('http://') || inviteUrl.startsWith('https://')) {
      return inviteUrl;
    }
    return `${window.location.origin}${inviteUrl}`;
  };

  const refreshAll = async () => {
    await Promise.all([refetchTeams(), refetchInvites()]);
  };

  if (teamsLoading || invitesLoading) {
    return (
      <main className="section-padding py-10">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Loading teams…</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="section-padding py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold">Teams</p>
          <p className="text-muted-foreground text-sm">
            Teams refine access to projects. Org-wide projects (no teams linked)
            are visible to all organization members.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link className="text-sm underline" href="/studio/projects">
              Back to projects
            </Link>
            <Button variant="ghost" onPress={() => void refreshAll()}>
              Refresh
            </Button>
          </div>
        </header>

        {invitesError ? (
          <Card className="p-6">
            <p className="text-sm font-semibold">Admin access required</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Only organization admins can manage teams and invitations.
            </p>
          </Card>
        ) : null}

        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="teamName">Create team</Label>
              <Input
                id="teamName"
                placeholder="e.g. Field ops"
                value={newTeamName}
                onChange={(value) => setNewTeamName(value.target.value)}
              />
              <Button
                variant="outline"
                disabled={createTeam.isPending || !newTeamName.trim()}
                onPress={() => {
                  void (async () => {
                    await createTeam.mutateAsync({ name: newTeamName });
                    setNewTeamName('');
                    await refreshAll();
                  })();
                }}
              >
                {createTeam.isPending ? 'Creating…' : 'Create team'}
              </Button>
              {createTeam.error ? (
                <p className="text-sm text-red-400">
                  {String(createTeam.error)}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Invite member</p>
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email</Label>
                <Input
                  id="inviteEmail"
                  placeholder="teammate@company.com"
                  value={inviteEmail}
                  onChange={(value) => setInviteEmail(value.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value) =>
                      setInviteRole(value as InviteRole)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Team (optional)</Label>
                  <Select value={inviteTeamId} onValueChange={setInviteTeamId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No team</SelectItem>
                      {teams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                disabled={inviteToOrg.isPending || !inviteEmail.trim()}
                onPress={() => {
                  void (async () => {
                    const result = await inviteToOrg.mutateAsync({
                      email: inviteEmail,
                      role: inviteRole,
                      teamId: inviteTeamId === '__none__' ? undefined : inviteTeamId,
                    });
                    setInviteEmail('');
                    await refreshAll();
                    const inviteUrl = result.inviteToOrganization.inviteUrl;
                    const link = fullInviteLink(inviteUrl);
                    await navigator.clipboard.writeText(link);
                  })();
                }}
              >
                {inviteToOrg.isPending ? 'Inviting…' : 'Send invite'}
              </Button>
              <p className="text-muted-foreground text-xs">
                After sending, we copy the invite link to your clipboard.
              </p>
              {inviteToOrg.error ? (
                <p className="text-sm text-red-400">
                  {String(inviteToOrg.error)}
                </p>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold">Teams</p>
          {teams.length ? (
            <div className="mt-3 space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{team.name}</p>
                    <p className="text-muted-foreground text-xs">{team.id}</p>
                  </div>

                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <Input
                      aria-label={`Rename team ${team.name}`}
                      placeholder="New name"
                      value={renameDraft[team.id] ?? ''}
                      onChange={(value) =>
                        setRenameDraft((prev) => ({
                          ...prev,
                          [team.id]: value.target.value,
                        }))
                      }
                    />
                    <Button
                      variant="outline"
                      disabled={
                        renameTeam.isPending || !(renameDraft[team.id] ?? '').trim()
                      }
                      onPress={() => {
                        void (async () => {
                          const next = (renameDraft[team.id] ?? '').trim();
                          await renameTeam.mutateAsync({
                            teamId: team.id,
                            name: next,
                          });
                          setRenameDraft((prev) => ({ ...prev, [team.id]: '' }));
                          await refreshAll();
                        })();
                      }}
                    >
                      Rename
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={deleteTeam.isPending}
                      onPress={() => {
                        void (async () => {
                          await deleteTeam.mutateAsync({ teamId: team.id });
                          await refreshAll();
                        })();
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-2 text-sm">
              No teams yet.
            </p>
          )}
          {renameTeam.error ? (
            <p className="mt-3 text-sm text-red-400">
              {String(renameTeam.error)}
            </p>
          ) : null}
          {deleteTeam.error ? (
            <p className="mt-3 text-sm text-red-400">
              {String(deleteTeam.error)}
            </p>
          ) : null}
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold">Invitations</p>
          {invitations.length ? (
            <div className="mt-3 space-y-3">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{inv.email}</p>
                    <p className="text-muted-foreground text-xs">
                      Status: {inv.status}
                      {inv.teamId ? ` · Team: ${inv.teamId}` : ' · Org-wide'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      onPress={() => {
                        void navigator.clipboard.writeText(
                          fullInviteLink(`/invite/${inv.id}`)
                        );
                      }}
                    >
                      Copy link
                    </Button>
                    <Link className="text-sm underline" href={`/invite/${inv.id}`}>
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-2 text-sm">
              No invitations yet.
            </p>
          )}
        </Card>
      </div>
    </main>
  );
}






