import { type TaskCategory, type TaskPriority } from './types';

export interface FilterState {
	status: 'all' | 'active' | 'completed';
	priority: TaskPriority | 'all';
	categoryId: string | 'all';
	search: string;
}

export interface FilterBarProps {
	value: FilterState;
	onChange: (next: FilterState) => void;
	categories: TaskCategory[];
}

export function FilterBar({ value, onChange, categories }: FilterBarProps) {
	const handleChange = <
		TKey extends keyof FilterState,
		TValue extends FilterState[TKey],
	>(
		key: TKey,
		nextValue: TValue
	) => {
		onChange({ ...value, [key]: nextValue });
	};

	return (
		<div className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-4">
			<label className="flex flex-col text-muted-foreground text-xs uppercase tracking-wide">
				Status
				<select
					className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm"
					value={value.status}
					onChange={(event) =>
						handleChange('status', event.target.value as FilterState['status'])
					}
				>
					<option value="all">All tasks</option>
					<option value="active">Active</option>
					<option value="completed">Completed</option>
				</select>
			</label>

			<label className="flex flex-col text-muted-foreground text-xs uppercase tracking-wide">
				Priority
				<select
					className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm"
					value={value.priority}
					onChange={(event) =>
						handleChange(
							'priority',
							event.target.value as FilterState['priority']
						)
					}
				>
					<option value="all">All</option>
					<option value="LOW">Low</option>
					<option value="MEDIUM">Medium</option>
					<option value="HIGH">High</option>
					<option value="URGENT">Urgent</option>
				</select>
			</label>

			<label className="flex flex-col text-muted-foreground text-xs uppercase tracking-wide">
				Category
				<select
					className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm"
					value={value.categoryId}
					onChange={(event) =>
						handleChange(
							'categoryId',
							event.target.value as FilterState['categoryId']
						)
					}
				>
					<option value="all">All categories</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			</label>

			<label className="flex flex-col text-muted-foreground text-xs uppercase tracking-wide">
				Search
				<input
					type="search"
					className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm"
					placeholder="Search by title"
					value={value.search}
					onChange={(event) => handleChange('search', event.target.value)}
				/>
			</label>
		</div>
	);
}
