import { BookCopy, Plus, RefreshCcw } from 'lucide-react';

export interface KnowledgeSourceItem {
	id: string;
	name: string;
	type: string;
	indexed: boolean;
	lastIndexed?: string | null;
}

export interface KnowledgeSourceListProps {
	sources: KnowledgeSourceItem[];
	onRefresh?: (id: string) => void;
	onDelete?: (id: string) => void;
	onAdd?: () => void;
}

export function KnowledgeSourceList({
	sources,
	onRefresh,
	onDelete,
	onAdd,
}: KnowledgeSourceListProps) {
	// const knowledgeHubEnabled = useStudioFeatureFlag(
	//   ContractSpecFeatureFlags.STUDIO_KNOWLEDGE_HUB
	// );
	//
	// if (!knowledgeHubEnabled) {
	//   return (
	//     <div className="border-border bg-card/40 rounded-2xl border border-dashed p-8 text-center">
	//       <FeatureGateNotice
	//         title="Knowledge hub is paused"
	//         description="Turn on STUDIO_KNOWLEDGE_HUB to index docs and feed answers into the Studio canvas."
	//       />
	//     </div>
	//   );
	// }

	return (
		<div className="space-y-4 rounded-2xl border border-border bg-card p-4">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="font-semibold text-sm uppercase tracking-wide">
						Knowledge sources
					</p>
					<p className="text-muted-foreground text-sm">
						Manage documentation, specs, and repos powering Studio RAG flows.
					</p>
				</div>
				<button
					type="button"
					className="btn-primary inline-flex items-center gap-2"
					onClick={onAdd}
				>
					<Plus className="h-4 w-4" />
					Add source
				</button>
			</header>
			<div className="space-y-3">
				{sources.length ? (
					sources.map((source) => (
						<div
							key={source.id}
							className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4"
						>
							<div className="flex items-center gap-3">
								<BookCopy className="h-8 w-8 text-muted-foreground" />
								<div>
									<p className="font-semibold text-base">{source.name}</p>
									<p className="text-muted-foreground text-sm">{source.type}</p>
									<p className="text-muted-foreground text-xs">
										{source.indexed
											? `Indexed ${source.lastIndexed ? new Date(source.lastIndexed).toLocaleString() : ''}`
											: 'Pending indexing'}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									type="button"
									className="btn-ghost inline-flex items-center gap-1 text-sm"
									onClick={() => onRefresh?.(source.id)}
								>
									<RefreshCcw className="h-3.5 w-3.5" />
									Reindex
								</button>
								<button
									type="button"
									className="btn-ghost text-destructive text-sm"
									onClick={() => onDelete?.(source.id)}
								>
									Remove
								</button>
							</div>
						</div>
					))
				) : (
					<div className="rounded-xl border border-border border-dashed p-6 text-center text-muted-foreground text-sm">
						No knowledge sources added yet.
					</div>
				)}
			</div>
		</div>
	);
}
