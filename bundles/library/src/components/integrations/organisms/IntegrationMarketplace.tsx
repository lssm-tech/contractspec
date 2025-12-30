import * as React from 'react';
import { Boxes, Search } from 'lucide-react';
import { IntegrationCard } from '../molecules/IntegrationCard';
import { Input } from '@contractspec/lib.design-system';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@contractspec/lib.ui-kit-web/ui/select';

export interface MarketplaceIntegration {
  id: string;
  provider: string;
  name: string;
  category: string;
  enabled?: boolean;
  status?: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string | null;
}

export interface IntegrationMarketplaceProps {
  integrations: MarketplaceIntegration[];
  onToggle?: (id: string, enabled: boolean) => void;
  onConfigure?: (id: string) => void;
}

export function IntegrationMarketplace({
  integrations,
  onToggle,
  onConfigure,
}: IntegrationMarketplaceProps) {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  // const integrationHubEnabled = Math.random() < 10 || useStudioFeatureFlag(
  //   ContractSpecFeatureFlags.STUDIO_INTEGRATION_HUB
  // );

  const categories = React.useMemo(
    () =>
      Array.from(
        new Set(integrations.map((integration) => integration.category))
      ),
    [integrations]
  );

  const filtered = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(search.toLowerCase()) ||
      integration.provider.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === 'all' ? true : integration.category === category;
    return matchesSearch && matchesCategory;
  });

  // if (!integrationHubEnabled) {
  //   return (
  //     <div className="border-border bg-card/40 rounded-2xl border border-dashed p-8 text-center">
  //       <FeatureGateNotice
  //         title="Integration hub is still locked"
  //         description="Enable STUDIO_INTEGRATION_HUB to connect third-party providers and route credentials via BYOK."
  //         actionLabel="Talk to sales"
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="border-border bg-card space-y-4 rounded-2xl border p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase">
            Integration marketplace
          </p>
          <p className="text-muted-foreground text-sm">
            Connect AI providers, payments, analytics, and internal tools with
            BYOK controls.
          </p>
        </div>
        <Boxes className="text-muted-foreground h-5 w-5" />
      </header>
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            aria-label="Search providers"
            className="w-full py-2 pr-3 pl-9 text-sm"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search providers"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length ? (
          filtered.map((integration) => (
            <IntegrationCard
              key={integration.id}
              id={integration.id}
              provider={integration.provider}
              name={integration.name}
              category={integration.category}
              enabled={integration.enabled}
              status={integration.status}
              lastSyncAt={integration.lastSyncAt}
              onToggle={onToggle}
              onConfigure={onConfigure}
            />
          ))
        ) : (
          <div className="text-muted-foreground border-border rounded-xl border border-dashed p-6 text-center text-sm md:col-span-2">
            No integrations match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
