'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrganizationType } from '@contractspec/lib.database-studio/enums';
import { Button, Input } from '@contractspec/lib.design-system';

interface OrganizationSummary {
  id: string;
  name: string;
  slug: string | null;
  type: OrganizationType;
  onboardingCompleted: boolean;
  role: string;
}

interface OrganizationsResponse {
  organizations: OrganizationSummary[];
}

const ORG_TYPE_OPTIONS: { label: string; value: OrganizationType }[] = [
  {
    label: 'Workspace (recommended)',
    value: OrganizationType.CONTRACT_SPEC_CUSTOMER,
  },
  // {
  //   label: 'Platform admin',
  //   value: OrganizationType.PLATFORM_ADMIN,
  // },
];

export default function OrgSelectClient() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    name: string;
    type: OrganizationType;
  }>({
    name: ORG_TYPE_OPTIONS[0].label,
    type: ORG_TYPE_OPTIONS[0].value,
  });

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/organizations', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Unable to load organizations.');
      }
      const data = (await response.json()) as OrganizationsResponse;
      setOrganizations(data.organizations ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load organizations right now.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  const hasOrganizations = organizations.length > 0;

  const orderedOrganizations = useMemo(
    () =>
      [...organizations].sort((a, b) => {
        if (a.onboardingCompleted === b.onboardingCompleted) {
          return a.name.localeCompare(b.name);
        }
        return a.onboardingCompleted ? -1 : 1;
      }),
    [organizations]
  );

  const createOrg = async () => {
    if (!formState.name.trim()) {
      setError('Organization name is required');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          type: formState.type,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Unable to create organization.');
      }
      const payload = await response.json();
      setOrganizations((prev) => [...prev, payload.organization]);
      router.replace('/studio');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create organization right now.'
      );
    } finally {
      setCreating(false);
    }
  };

  const activateOrg = async (organizationId: string) => {
    setActivateError(null);
    try {
      const response = await fetch('/api/organizations/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Unable to switch workspace.');
      }
      router.replace('/studio');
    } catch (err) {
      setActivateError(
        err instanceof Error
          ? err.message
          : 'Unable to switch workspace right now.'
      );
    }
  };

  return (
    <main className="section-padding min-h-screen space-y-10 py-16">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Workspace selection
        </p>
        <h1 className="text-4xl font-bold md:text-5xl">
          Choose where your specs live
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-base">
          Each ContractSpec workspace keeps policies, specs, and deployments
          isolated by organization. Pick an existing workspace or create a new
          one to continue.
        </p>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your workspaces</h2>
            <Button variant="ghost" onClick={() => void loadOrganizations()}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="border-border bg-card text-muted-foreground rounded-2xl border p-6 text-center text-sm">
              Loading workspaces…
            </div>
          ) : hasOrganizations ? (
            <div className="space-y-4">
              {orderedOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="border-border bg-card rounded-2xl border p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold">{org.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {org.type.replaceAll('_', ' ')} · Role: {org.role}
                      </p>
                      {!org.onboardingCompleted ? (
                        <p className="mt-1 text-xs text-amber-300">
                          Finish onboarding to unlock deployments
                        </p>
                      ) : null}
                    </div>
                    <Button
                      onClick={() => activateOrg(org.id)}
                      variant="secondary"
                      className="w-full md:w-auto"
                    >
                      Use this workspace
                    </Button>
                  </div>
                </div>
              ))}
              {activateError ? (
                <p className="text-sm text-red-400">{activateError}</p>
              ) : null}
            </div>
          ) : (
            <div className="border-border bg-card text-muted-foreground rounded-2xl border p-6 text-center text-sm">
              No workspaces yet. Create one to get started.
            </div>
          )}
        </div>

        <div className="border-border bg-card space-y-5 rounded-2xl border p-6">
          <div>
            <h2 className="text-xl font-semibold">Create a workspace</h2>
            <p className="text-muted-foreground text-sm">
              Use workspaces to isolate environments, tenants, or clients. You
              can add teammates later.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="orgName" className="text-sm font-medium">
                Workspace name (can be changed later)
              </label>
              <Input
                id="orgName"
                placeholder="e.g. Atlas Field Ops"
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                required
              />
            </div>

            {ORG_TYPE_OPTIONS.length > 1 && (
              <div className="space-y-2">
                <label htmlFor="orgType" className="text-sm font-medium">
                  Workspace type
                </label>
                <div className="space-y-2">
                  {ORG_TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormState((prev) => ({
                          ...prev,
                          type: option.value,
                        }))
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        formState.type === option.value
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-border hover:border-violet-500/40'
                      }`}
                    >
                      <p className="font-medium">{option.label}</p>
                      <p className="text-muted-foreground text-xs">
                        {option.value ===
                        OrganizationType.CONTRACT_SPEC_CUSTOMER
                          ? 'Recommended for builders and teams'
                          : 'Reserved for platform maintainers'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => void createOrg()}
              className="w-full"
              disabled={creating}
            >
              {creating ? 'Creating workspace…' : 'Create workspace'}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
