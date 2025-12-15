'use client';

import * as React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Input, Textarea } from '@lssm/lib.design-system';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Badge } from '@lssm/lib.ui-kit-web/ui/badge';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';
import { Checkbox } from '@lssm/lib.ui-kit-web/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';
import { VStack, HStack } from '@lssm/lib.ui-kit-web/ui/stack';
import { Separator } from '@lssm/lib.ui-kit-web/ui/separator';
import { useAuthContext } from '@lssm/bundle.contractspec-studio/presentation/providers/auth';
import { authClient } from '@lssm/bundle.contractspec-studio/presentation/providers/auth/client';

type PlatformOrg = {
  id: string;
  name: string;
  slug?: string | null;
  type: string;
  createdAt: string;
};

type PlatformIntegrationSpec = {
  key: string;
  version: number;
  category: string;
  displayName: string;
  title: string;
  description: string;
  supportedModes: string[];
  docsUrl?: string | null;
  configSchema: unknown;
  secretSchema: unknown;
  byokSetup?: unknown | null;
};

type PlatformIntegrationConnection = {
  id: string;
  organizationId: string;
  integrationKey: string;
  integrationVersion: number;
  label: string;
  environment?: string | null;
  ownershipMode: 'managed' | 'byok';
  externalAccountId?: string | null;
  secretProvider: string;
  secretRef: string;
  config: unknown;
  status: 'connected' | 'disconnected' | 'error' | 'unknown';
  createdAt: string;
  updatedAt: string;
};

async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }

  if (!payload.data) {
    throw new Error('No data returned from GraphQL');
  }

  return payload.data;
}

const ORGS_QUERY = /* GraphQL */ `
  query PlatformAdminOrganizations($search: String, $limit: Int, $offset: Int) {
    platformAdminOrganizations(
      search: $search
      limit: $limit
      offset: $offset
    ) {
      id
      name
      slug
      type
      createdAt
    }
  }
`;

const SPECS_QUERY = /* GraphQL */ `
  query PlatformAdminIntegrationSpecs {
    platformAdminIntegrationSpecs {
      key
      version
      category
      displayName
      title
      description
      supportedModes
      docsUrl
      configSchema
      secretSchema
      byokSetup
    }
  }
`;

const CONNECTIONS_QUERY = /* GraphQL */ `
  query PlatformAdminIntegrationConnections(
    $input: PlatformIntegrationConnectionListInput!
  ) {
    platformAdminIntegrationConnections(input: $input) {
      id
      organizationId
      integrationKey
      integrationVersion
      label
      environment
      ownershipMode
      externalAccountId
      secretProvider
      secretRef
      config
      status
      createdAt
      updatedAt
    }
  }
`;

const CREATE_CONNECTION_MUTATION = /* GraphQL */ `
  mutation PlatformAdminIntegrationConnectionCreate(
    $input: PlatformIntegrationConnectionCreateInput!
  ) {
    platformAdminIntegrationConnectionCreate(input: $input) {
      id
      organizationId
      integrationKey
      integrationVersion
      label
      environment
      ownershipMode
      externalAccountId
      secretProvider
      secretRef
      config
      status
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_CONNECTION_MUTATION = /* GraphQL */ `
  mutation PlatformAdminIntegrationConnectionUpdate(
    $input: PlatformIntegrationConnectionUpdateInput!
  ) {
    platformAdminIntegrationConnectionUpdate(input: $input) {
      id
      organizationId
      integrationKey
      integrationVersion
      label
      environment
      ownershipMode
      externalAccountId
      secretProvider
      secretRef
      config
      status
      createdAt
      updatedAt
    }
  }
`;

const DELETE_CONNECTION_MUTATION = /* GraphQL */ `
  mutation PlatformAdminIntegrationConnectionDelete(
    $targetOrganizationId: String!
    $connectionId: String!
  ) {
    platformAdminIntegrationConnectionDelete(
      targetOrganizationId: $targetOrganizationId
      connectionId: $connectionId
    )
  }
`;

export default function StudioAdminClient() {
  const { organization } = useAuthContext();

  const [orgSearch, setOrgSearch] = React.useState('');
  const [selectedOrgId, setSelectedOrgId] = React.useState<string | null>(null);

  const orgsQuery = useQuery({
    queryKey: ['platformAdminOrganizations', orgSearch],
    queryFn: async () => {
      const data = await fetchGraphQL<{
        platformAdminOrganizations: PlatformOrg[];
      }>(ORGS_QUERY, {
        search: orgSearch.trim() || undefined,
        limit: 100,
        offset: 0,
      });
      return data.platformAdminOrganizations;
    },
    staleTime: 30_000,
  });

  const specsQuery = useQuery({
    queryKey: ['platformAdminIntegrationSpecs'],
    queryFn: async () => {
      const data = await fetchGraphQL<{
        platformAdminIntegrationSpecs: PlatformIntegrationSpec[];
      }>(SPECS_QUERY);
      return data.platformAdminIntegrationSpecs;
    },
    staleTime: 60_000,
  });

  React.useEffect(() => {
    if (selectedOrgId) return;
    const first = orgsQuery.data?.[0];
    if (first?.id) {
      setSelectedOrgId(first.id);
    }
  }, [orgsQuery.data, selectedOrgId]);

  const connectionsQuery = useQuery({
    queryKey: ['platformAdminIntegrationConnections', selectedOrgId],
    enabled: Boolean(selectedOrgId),
    queryFn: async () => {
      const data = await fetchGraphQL<{
        platformAdminIntegrationConnections: PlatformIntegrationConnection[];
      }>(CONNECTIONS_QUERY, {
        input: {
          targetOrganizationId: selectedOrgId,
        },
      });
      return data.platformAdminIntegrationConnections;
    },
    staleTime: 15_000,
  });

  const [editingConnectionId, setEditingConnectionId] = React.useState<
    string | null
  >(null);

  const specs = specsQuery.data ?? [];
  const specOptions = React.useMemo(() => {
    return specs
      .slice()
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map((s) => ({
        id: `${s.key}::${s.version}`,
        label: `${s.displayName} · ${s.key}.v${s.version}`,
        spec: s,
      }));
  }, [specs]);

  const [selectedSpecId, setSelectedSpecId] = React.useState<string>('');
  const [label, setLabel] = React.useState('');
  const [environment, setEnvironment] = React.useState('');
  const [ownershipMode, setOwnershipMode] = React.useState<'managed' | 'byok'>(
    'managed'
  );
  const [status, setStatus] = React.useState<
    'connected' | 'disconnected' | 'error' | 'unknown'
  >('unknown');
  const [secretProvider, setSecretProvider] =
    React.useState('gcp-secret-manager');
  const [secretRef, setSecretRef] = React.useState('');
  const [configJson, setConfigJson] = React.useState(
    JSON.stringify({ region: 'eu-west-1' }, null, 2)
  );

  const [writeSecretEnabled, setWriteSecretEnabled] = React.useState(false);
  const [secretPayload, setSecretPayload] = React.useState(
    JSON.stringify({ apiKey: '***' }, null, 2)
  );
  const [secretEncoding, setSecretEncoding] = React.useState<
    'utf-8' | 'base64' | 'binary'
  >('utf-8');

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOrgId) throw new Error('Select an organization first');
      const selected = specOptions.find((o) => o.id === selectedSpecId)?.spec;
      if (!selected) throw new Error('Select an integration spec');
      if (!label.trim()) throw new Error('Label is required');
      if (!secretRef.trim()) throw new Error('Secret reference is required');

      const config = safeParseJsonObject(configJson, 'Config');

      const variables = {
        input: {
          targetOrganizationId: selectedOrgId,
          integrationKey: selected.key,
          integrationVersion: selected.version,
          label: label.trim(),
          environment: environment.trim() || undefined,
          ownershipMode,
          externalAccountId: undefined,
          secretProvider: secretProvider.trim() || 'gcp-secret-manager',
          secretRef: secretRef.trim(),
          config,
          status,
          secretWrite: writeSecretEnabled
            ? {
                data: secretPayload,
                encoding: secretEncoding,
              }
            : undefined,
        },
      };

      const data = await fetchGraphQL<{
        platformAdminIntegrationConnectionCreate: PlatformIntegrationConnection;
      }>(CREATE_CONNECTION_MUTATION, variables);

      return data.platformAdminIntegrationConnectionCreate;
    },
    onSuccess: async () => {
      await connectionsQuery.refetch();
      setEditingConnectionId(null);
      setLabel('');
      setEnvironment('');
      setSecretRef('');
      setWriteSecretEnabled(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOrgId) throw new Error('Select an organization first');
      if (!editingConnectionId) throw new Error('Select a connection to edit');

      const config = safeParseJsonObject(configJson, 'Config');

      const variables = {
        input: {
          targetOrganizationId: selectedOrgId,
          connectionId: editingConnectionId,
          label: label.trim() || undefined,
          environment: environment.trim() || undefined,
          ownershipMode,
          externalAccountId: undefined,
          secretProvider: secretProvider.trim() || undefined,
          secretRef: secretRef.trim() || undefined,
          config,
          status,
          secretWrite: writeSecretEnabled
            ? {
                data: secretPayload,
                encoding: secretEncoding,
              }
            : undefined,
        },
      };

      const data = await fetchGraphQL<{
        platformAdminIntegrationConnectionUpdate: PlatformIntegrationConnection;
      }>(UPDATE_CONNECTION_MUTATION, variables);

      return data.platformAdminIntegrationConnectionUpdate;
    },
    onSuccess: async () => {
      await connectionsQuery.refetch();
      setEditingConnectionId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      if (!selectedOrgId) throw new Error('Select an organization first');
      const data = await fetchGraphQL<{
        platformAdminIntegrationConnectionDelete: boolean;
      }>(DELETE_CONNECTION_MUTATION, {
        targetOrganizationId: selectedOrgId,
        connectionId,
      });
      return data.platformAdminIntegrationConnectionDelete;
    },
    onSuccess: async () => {
      await connectionsQuery.refetch();
    },
  });

  const connections = connectionsQuery.data ?? [];

  const selectedOrg =
    orgsQuery.data?.find((o) => o.id === selectedOrgId) ?? null;

  const isPlatformAdminOrg = organization?.type === 'PLATFORM_ADMIN';

  return (
    <VStack gap="lg" className="mx-auto w-full max-w-7xl px-4 py-6">
      {!isPlatformAdminOrg ? (
        <Card className="p-6">
          <p className="text-sm font-semibold">Admin panel</p>
          <p className="text-muted-foreground mt-1 text-sm">
            This page is only available to platform admins.
          </p>
        </Card>
      ) : null}

      {isPlatformAdminOrg ? (
        <>
          <VStack gap="sm">
            <p className="text-lg font-semibold">Platform admin</p>
            <p className="text-muted-foreground text-sm">
              Manage tenant organizations and ContractSpec integrations.
            </p>
          </VStack>

          <HStack gap="md" className="items-stretch">
            <Card className="w-full p-4 md:w-[360px]">
              <VStack gap="sm">
                <p className="text-sm font-semibold">Organizations</p>

                <Input
                  aria-label="Search organizations"
                  placeholder="Search by name or slug"
                  value={orgSearch}
                  onChange={(e) => setOrgSearch(e.target.value)}
                />

                <Select
                  value={selectedOrgId ?? ''}
                  onValueChange={(value) => setSelectedOrgId(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {(orgsQuery.data ?? []).map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                        {org.slug ? ` (${org.slug})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {orgsQuery.isLoading ? (
                  <p className="text-muted-foreground text-xs">Loading…</p>
                ) : null}
                {orgsQuery.error ? (
                  <p className="text-destructive text-xs">
                    {(orgsQuery.error as Error).message}
                  </p>
                ) : null}

                {selectedOrg ? (
                  <div className="rounded-md border p-3 text-xs">
                    <p className="font-semibold">Selected</p>
                    <p className="text-muted-foreground mt-1">
                      {selectedOrg.name}
                    </p>
                    <HStack gap="sm" className="mt-2">
                      <Badge variant="secondary">{selectedOrg.type}</Badge>
                      {selectedOrg.slug ? (
                        <Badge variant="outline">{selectedOrg.slug}</Badge>
                      ) : null}
                    </HStack>
                  </div>
                ) : null}
              </VStack>
            </Card>

            <Card className="flex-1 p-4">
              <VStack gap="md">
                <HStack gap="md" className="items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">Integrations</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Create and manage tenant integration connections.
                    </p>
                  </div>
                  <Badge variant="outline">
                    {connections.length} connections
                  </Badge>
                </HStack>

                <Separator />

                <VStack gap="md">
                  <HStack gap="md" className="items-end">
                    <VStack gap="xs" className="flex-1">
                      <Label>Integration spec</Label>
                      <Select
                        value={selectedSpecId}
                        onValueChange={setSelectedSpecId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {specOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </VStack>

                    <VStack gap="xs" className="w-[220px]">
                      <Label>Ownership</Label>
                      <Select
                        value={ownershipMode}
                        onValueChange={(v) =>
                          setOwnershipMode(v as 'managed' | 'byok')
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="managed">managed</SelectItem>
                          <SelectItem value="byok">byok</SelectItem>
                        </SelectContent>
                      </Select>
                    </VStack>

                    <VStack gap="xs" className="w-[220px]">
                      <Label>Status</Label>
                      <Select
                        value={status}
                        onValueChange={(v) =>
                          setStatus(
                            v as
                              | 'connected'
                              | 'disconnected'
                              | 'error'
                              | 'unknown'
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unknown">unknown</SelectItem>
                          <SelectItem value="connected">connected</SelectItem>
                          <SelectItem value="disconnected">
                            disconnected
                          </SelectItem>
                          <SelectItem value="error">error</SelectItem>
                        </SelectContent>
                      </Select>
                    </VStack>
                  </HStack>

                  <HStack gap="md" className="items-end">
                    <VStack gap="xs" className="flex-1">
                      <Label>Label</Label>
                      <Input
                        aria-label="Connection label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. Production Stripe"
                      />
                    </VStack>
                    <VStack gap="xs" className="w-[220px]">
                      <Label>Environment</Label>
                      <Input
                        aria-label="Environment"
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                        placeholder="prod"
                      />
                    </VStack>
                  </HStack>

                  <HStack gap="md" className="items-end">
                    <VStack gap="xs" className="w-[260px]">
                      <Label>Secret provider</Label>
                      <Input
                        aria-label="Secret provider"
                        value={secretProvider}
                        onChange={(e) => setSecretProvider(e.target.value)}
                        placeholder="gcp-secret-manager"
                      />
                    </VStack>
                    <VStack gap="xs" className="flex-1">
                      <Label>Secret reference</Label>
                      <Input
                        aria-label="Secret reference"
                        value={secretRef}
                        onChange={(e) => setSecretRef(e.target.value)}
                        placeholder="gcp://projects/.../secrets/.../versions/latest"
                      />
                    </VStack>
                  </HStack>

                  <VStack gap="xs">
                    <Label>Config (JSON)</Label>
                    <Textarea
                      aria-label="Config JSON"
                      className="min-h-[120px] font-mono text-sm"
                      value={configJson}
                      onChange={(e) => setConfigJson(e.target.value)}
                    />
                  </VStack>

                  <HStack gap="md" className="items-center">
                    <HStack gap="sm" className="items-center">
                      <Checkbox
                        checked={writeSecretEnabled}
                        onCheckedChange={(value) =>
                          setWriteSecretEnabled(Boolean(value))
                        }
                        aria-label="Write secret payload"
                      />
                      <p className="text-sm font-medium">Write/rotate secret</p>
                    </HStack>
                    <Badge variant="secondary">GCP</Badge>
                    <Badge variant="secondary">AWS</Badge>
                    <Badge variant="secondary">Scaleway</Badge>
                    <Badge variant="outline">env overrides supported</Badge>
                  </HStack>

                  {writeSecretEnabled ? (
                    <VStack gap="sm">
                      <HStack gap="md" className="items-end">
                        <VStack gap="xs" className="w-[220px]">
                          <Label>Secret encoding</Label>
                          <Select
                            value={secretEncoding}
                            onValueChange={(v) =>
                              setSecretEncoding(
                                v as 'utf-8' | 'base64' | 'binary'
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utf-8">utf-8</SelectItem>
                              <SelectItem value="base64">base64</SelectItem>
                              <SelectItem value="binary">binary</SelectItem>
                            </SelectContent>
                          </Select>
                        </VStack>
                        <div className="text-muted-foreground flex-1 text-xs">
                          Write-only: secret values are never displayed.
                        </div>
                      </HStack>
                      <Textarea
                        aria-label="Secret payload"
                        className="min-h-[140px] font-mono text-sm"
                        value={secretPayload}
                        onChange={(e) => setSecretPayload(e.target.value)}
                      />
                    </VStack>
                  ) : null}

                  <HStack gap="md" className="items-center justify-end">
                    <Button
                      variant="ghost"
                      onPress={() => {
                        setEditingConnectionId(null);
                      }}
                      disabled={!editingConnectionId}
                    >
                      Cancel edit
                    </Button>
                    <Button
                      onPress={() => {
                        if (editingConnectionId) {
                          void updateMutation.mutateAsync();
                          return;
                        }
                        void createMutation.mutateAsync();
                      }}
                      loading={
                        createMutation.isPending || updateMutation.isPending
                      }
                      disabled={!selectedOrgId}
                    >
                      {editingConnectionId
                        ? 'Update connection'
                        : 'Create connection'}
                    </Button>
                  </HStack>

                  {createMutation.error || updateMutation.error ? (
                    <p className="text-destructive text-sm">
                      {(createMutation.error as Error | null)?.message ??
                        (updateMutation.error as Error | null)?.message}
                    </p>
                  ) : null}
                </VStack>

                <Separator />

                <VStack gap="sm">
                  {connectionsQuery.isLoading ? (
                    <p className="text-muted-foreground text-sm">
                      Loading connections…
                    </p>
                  ) : null}

                  {connections.map((conn) => {
                    const spec = specs.find(
                      (s) =>
                        s.key === conn.integrationKey &&
                        s.version === conn.integrationVersion
                    );
                    return (
                      <Card key={conn.id} className="p-4">
                        <VStack gap="sm">
                          <HStack
                            gap="md"
                            className="items-start justify-between"
                          >
                            <div>
                              <p className="text-sm font-semibold">
                                {conn.label}
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                {spec
                                  ? `${spec.displayName} · ${spec.category}`
                                  : `${conn.integrationKey}.v${conn.integrationVersion}`}
                                {conn.environment
                                  ? ` · ${conn.environment}`
                                  : ''}
                              </p>
                            </div>
                            <HStack gap="sm" className="items-center">
                              <Badge
                                variant={
                                  conn.status === 'connected'
                                    ? 'default'
                                    : conn.status === 'error'
                                      ? 'destructive'
                                      : 'secondary'
                                }
                              >
                                {conn.status}
                              </Badge>
                              <Badge variant="outline">
                                {conn.ownershipMode}
                              </Badge>
                            </HStack>
                          </HStack>

                          <div className="text-xs">
                            <p className="text-muted-foreground">Secret ref</p>
                            <p className="mt-1 font-mono break-all">
                              {conn.secretRef}
                            </p>
                          </div>

                          <HStack gap="md" className="items-center justify-end">
                            <Button
                              variant="ghost"
                              onPress={() => {
                                setEditingConnectionId(conn.id);
                                setSelectedSpecId(
                                  `${conn.integrationKey}::${conn.integrationVersion}`
                                );
                                setLabel(conn.label);
                                setEnvironment(conn.environment ?? '');
                                setOwnershipMode(conn.ownershipMode);
                                setStatus(conn.status);
                                setSecretProvider(conn.secretProvider);
                                setSecretRef(conn.secretRef);
                                setConfigJson(
                                  JSON.stringify(conn.config ?? {}, null, 2)
                                );
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              loading={deleteMutation.isPending}
                              onPress={() => {
                                void deleteMutation.mutateAsync(conn.id);
                              }}
                            >
                              Delete
                            </Button>
                          </HStack>
                        </VStack>
                      </Card>
                    );
                  })}

                  {!connections.length && !connectionsQuery.isLoading ? (
                    <Card className="p-6">
                      <p className="text-muted-foreground text-sm">
                        No integration connections for this organization yet.
                      </p>
                    </Card>
                  ) : null}
                </VStack>
              </VStack>
            </Card>
          </HStack>

          <Card className="p-4">
            <VStack gap="md">
              <p className="text-sm font-semibold">Users (Better Auth admin)</p>
              <p className="text-muted-foreground text-sm">
                Uses Better Auth Admin plugin to list and impersonate users.
              </p>
              <UsersAdminPanel />
            </VStack>
          </Card>
        </>
      ) : null}
    </VStack>
  );
}

interface AdminUserSummary {
  id: string;
  email: string | undefined;
  name: string | undefined;
  role: string | undefined;
  banned: boolean | undefined;
}

function UsersAdminPanel() {
  const [userSearch, setUserSearch] = React.useState('');
  const [users, setUsers] = React.useState<AdminUserSummary[]>([]);

  const listUsersMutation = useMutation({
    mutationFn: async () => {
      return await authClient.admin.listUsers({
        query: {
          searchField: 'email',
          searchOperator: 'contains',
          searchValue: userSearch.trim() || undefined,
          limit: 25,
          offset: 0,
        },
      });
    },
    onSuccess: (result) => {
      setUsers(extractAdminUsers(result));
    },
  });

  const impersonateMutation = useMutation({
    mutationFn: async (userId: string) => {
      await authClient.admin.impersonateUser({ userId });
    },
    onSuccess: () => {
      window.location.href = '/studio/projects';
    },
  });

  return (
    <VStack gap="md">
      <HStack gap="md" className="items-end">
        <VStack gap="xs" className="flex-1">
          <Label>Search users</Label>
          <Input
            aria-label="Search users"
            placeholder="email contains…"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </VStack>
        <Button
          onPress={async () => {
            await listUsersMutation.mutateAsync();
          }}
          loading={listUsersMutation.isPending}
        >
          List users
        </Button>
      </HStack>

      {listUsersMutation.error ? (
        <p className="text-destructive text-sm">
          {(listUsersMutation.error as Error).message}
        </p>
      ) : null}

      {users.length ? (
        <VStack gap="sm">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <HStack gap="md" className="items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {user.email ?? user.id}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {user.name ? `${user.name} · ` : ''}
                    role: {user.role ?? 'user'}
                    {user.banned ? ' · banned' : ''}
                  </p>
                </div>
                <HStack gap="sm" className="items-center">
                  <Button
                    variant="outline"
                    loading={impersonateMutation.isPending}
                    onPress={() => {
                      void impersonateMutation.mutateAsync(user.id);
                    }}
                  >
                    Impersonate
                  </Button>
                </HStack>
              </HStack>
            </Card>
          ))}
        </VStack>
      ) : (
        <p className="text-muted-foreground text-sm">
          {listUsersMutation.isPending
            ? 'Loading users…'
            : 'No users listed yet.'}
        </p>
      )}

      <p className="text-muted-foreground text-xs">
        Note: we never switch your active organization; platform admin
        operations are scoped via explicit targetOrganizationId.
      </p>
    </VStack>
  );
}

function extractAdminUsers(value: unknown): AdminUserSummary[] {
  if (!value || typeof value !== 'object') return [];
  const users = (value as { users?: unknown }).users;
  if (!Array.isArray(users)) return [];

  return users
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as {
        id?: unknown;
        email?: unknown;
        name?: unknown;
        role?: unknown;
        banned?: unknown;
      };
      if (typeof record.id !== 'string') return null;

      return {
        id: record.id,
        email: typeof record.email === 'string' ? record.email : undefined,
        name: typeof record.name === 'string' ? record.name : undefined,
        role: typeof record.role === 'string' ? record.role : undefined,
        banned: typeof record.banned === 'boolean' ? record.banned : undefined,
      } satisfies AdminUserSummary;
    })
    .filter((item): item is AdminUserSummary => item !== null);
}

function safeParseJsonObject(
  input: string,
  label: string
): Record<string, unknown> {
  const trimmed = input.trim();
  if (!trimmed) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    throw new Error(
      `${label} must be valid JSON (${error instanceof Error ? error.message : 'parse error'})`
    );
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object`);
  }

  return parsed as Record<string, unknown>;
}

