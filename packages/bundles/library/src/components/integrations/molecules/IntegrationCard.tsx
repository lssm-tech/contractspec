import { Button } from '@contractspec/lib.design-system';
import { PlugZap, ToggleRight } from 'lucide-react';

export interface IntegrationCardProps {
	id: string;
	provider: string;
	name: string;
	category?: string;
	enabled?: boolean;
	lastSyncAt?: string | null;
	status?: 'connected' | 'disconnected' | 'error';
	onToggle?: (id: string, enabled: boolean) => void;
	onConfigure?: (id: string) => void;
}

export function IntegrationCard({
	id,
	provider,
	name,
	category,
	enabled = true,
	lastSyncAt,
	status = 'connected',
	onToggle,
	onConfigure,
}: IntegrationCardProps) {
	const tone =
		status === 'connected'
			? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
			: status === 'error'
				? 'text-red-500 bg-red-500/10 border-red-500/30'
				: 'text-gray-500 bg-gray-500/10 border-gray-500/30';

	return (
		<div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
			<header className="flex items-center justify-between">
				<div>
					<p className="font-semibold text-xl">{name}</p>
					<p className="text-muted-foreground text-sm">{provider}</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold text-xs uppercase tracking-wide ${tone}`}
					onPress={() => onToggle?.(id, !enabled)}
				>
					<ToggleRight className="h-3.5 w-3.5" />
					{enabled ? 'Enabled' : 'Disabled'}
				</Button>
			</header>
			<div className="text-muted-foreground text-sm">
				{category && <span className="font-medium">{category}</span>}
				<div className="mt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide">
					<span className="inline-flex items-center gap-1">
						<PlugZap className="h-3 w-3" />
						{status}
					</span>
					<span>
						Last sync:{' '}
						{lastSyncAt
							? new Date(lastSyncAt).toLocaleString()
							: 'Not synced yet'}
					</span>
				</div>
			</div>
			<footer className="flex items-center gap-2">
				<Button className="flex-1" onPress={() => onConfigure?.(id)}>
					Configure
				</Button>
				<Button
					variant="ghost"
					className="flex-1"
					onPress={() => onToggle?.(id, !enabled)}
				>
					{enabled ? 'Disconnect' : 'Connect'}
				</Button>
			</footer>
		</div>
	);
}
