import { useQuery } from '@tanstack/react-query';

export type RegistryTemplate = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  source: 'registry';
  registryUrl?: string | null;
};

export function useRegistryTemplates() {
  return useQuery({
    queryKey: ['registryTemplates'] as const,
    queryFn: async (): Promise<RegistryTemplate[]> => {
      const registryUrl =
        process.env.NEXT_PUBLIC_CONTRACTSPEC_REGISTRY_URL ?? '';
      if (!registryUrl) return [];
      const res = await fetch(`${registryUrl.replace(/\/$/, '')}/r/contractspec.json`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return [];
      const json = (await res.json()) as {
        items?: Array<{
          name: string;
          type: string;
          title: string;
          description: string;
          meta?: { tags?: string[] };
        }>;
      };
      const items = json.items ?? [];
      return items
        .filter((i) => i.type === 'contractspec:template')
        .map((i) => ({
          id: i.name,
          name: i.title ?? i.name,
          description: i.description,
          tags: i.meta?.tags ?? [],
          source: 'registry' as const,
          registryUrl,
        }));
    },
  });
}


