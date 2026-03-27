'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Search } from 'lucide-react';
import type { TemplateSource } from './template-source';

export interface TemplatesBrowseControlsProps {
	registryConfigured: boolean;
	availableSources: readonly TemplateSource[];
	source: TemplateSource;
	onSourceChange: (source: TemplateSource) => void;
	search: string;
	onSearchChange: (value: string) => void;
	selectedTag: string | null;
	onTagChange: (tag: string | null) => void;
	availableTags: readonly string[];
}

export function TemplatesBrowseControls({
	registryConfigured,
	availableSources,
	source,
	onSourceChange,
	search,
	onSearchChange,
	selectedTag,
	onTagChange,
	availableTags,
}: TemplatesBrowseControlsProps) {
	return (
		<section className="editorial-section">
			<div className="editorial-shell space-y-6">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-3xl space-y-3">
						<p className="editorial-kicker">Browse by source</p>
						<h2 className="font-serif text-4xl tracking-[-0.04em]">
							Use local scenarios for core proof, then scan the community.
						</h2>
						<p className="text-muted-foreground text-sm leading-7">
							{registryConfigured
								? 'Local templates show the official adoption path. Community templates show where the ecosystem is pushing the system next.'
								: 'Local templates show the official adoption path. Community browsing appears automatically when a registry URL is configured.'}
						</p>
					</div>
					{registryConfigured ? (
						<div className="flex gap-2">
							{availableSources.map((option) => (
								<button
									key={option}
									onClick={() => onSourceChange(option)}
									className={cn(
										'rounded-full px-4 py-2 font-medium text-sm transition-colors',
										{
											'bg-primary text-primary-foreground': source === option,
											'border border-border bg-card hover:bg-card/80':
												source !== option,
										}
									)}
									aria-pressed={source === option}
								>
									{option === 'local' ? 'Local' : 'Community'}
								</button>
							))}
						</div>
					) : null}
				</div>

				<div className="editorial-panel space-y-5">
					<div className="relative">
						<Search
							className="absolute top-3.5 left-4 text-muted-foreground"
							size={18}
						/>
						<input
							type="text"
							placeholder="Search scenarios, industries, or tags"
							value={search}
							onChange={(event) => onSearchChange(event.target.value)}
							className="w-full rounded-full border border-border bg-background px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
							aria-label="Search templates"
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => onTagChange(null)}
							className={cn(
								'rounded-full px-4 py-2 font-medium text-sm transition-colors',
								{
									'bg-primary text-primary-foreground': selectedTag === null,
									'border border-border bg-card hover:bg-card/80':
										selectedTag !== null,
								}
							)}
							aria-pressed={selectedTag === null}
						>
							All
						</button>
						{availableTags.map((tag) => (
							<button
								key={tag}
								onClick={() => onTagChange(tag)}
								className={cn(
									'rounded-full px-4 py-2 font-medium text-sm transition-colors',
									{
										'bg-primary text-primary-foreground': selectedTag === tag,
										'border border-border bg-card hover:bg-card/80':
											selectedTag !== tag,
									}
								)}
								aria-pressed={selectedTag === tag}
							>
								{tag}
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
