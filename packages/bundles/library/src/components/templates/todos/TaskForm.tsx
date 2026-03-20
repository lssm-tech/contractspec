'use client';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';
import { useState } from 'react';
import { type TaskCategory, type TaskPriority } from './types';

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
    }
  }
`;

export interface TaskFormProps {
	categories: TaskCategory[];
}

export function TaskForm({ categories }: TaskFormProps) {
	const { projectId } = useTemplateRuntime();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
	const [categoryId, setCategoryId] = useState<string | 'none'>('none');
	const [tagsInput, setTagsInput] = useState('');
	const [createTask, { loading }] = useMutation(CREATE_TASK);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!title.trim()) return;
		await createTask({
			variables: {
				input: {
					projectId,
					title: title.trim(),
					description: description.trim() || undefined,
					priority,
					categoryId: categoryId === 'none' ? undefined : categoryId,
					tags: parseTags(tagsInput),
				},
			},
			refetchQueries: ['Tasks'],
			awaitRefetchQueries: true,
		});
		setTitle('');
		setDescription('');
		setPriority('MEDIUM');
		setCategoryId('none');
		setTagsInput('');
		// onCreated?.();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-3 rounded-2xl border border-border bg-background/60 p-4"
		>
			<div>
				<label className="font-semibold text-muted-foreground text-xs uppercase">
					Title
					<input
						type="text"
						className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
						placeholder="What needs to get done?"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						required
					/>
				</label>
			</div>

			<div>
				<label className="font-semibold text-muted-foreground text-xs uppercase">
					Description
					<textarea
						className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
						rows={3}
						placeholder="Add context or policy notes"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
					/>
				</label>
			</div>

			<div className="grid gap-3 md:grid-cols-3">
				<label className="font-semibold text-muted-foreground text-xs uppercase">
					Priority
					<select
						className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
						value={priority}
						onChange={(event) =>
							setPriority(event.target.value as TaskPriority)
						}
					>
						<option value="LOW">Low</option>
						<option value="MEDIUM">Medium</option>
						<option value="HIGH">High</option>
						<option value="URGENT">Urgent</option>
					</select>
				</label>

				<label className="font-semibold text-muted-foreground text-xs uppercase">
					Category
					<select
						className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
						value={categoryId}
						onChange={(event) => setCategoryId(event.target.value as string)}
					>
						<option value="none">None</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</label>

				<label className="font-semibold text-muted-foreground text-xs uppercase">
					Tags
					<input
						className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
						placeholder="Comma separated (optional)"
						value={tagsInput}
						onChange={(event) => setTagsInput(event.target.value)}
					/>
				</label>
			</div>

			<button
				type="submit"
				className="btn-primary w-full py-2 font-semibold text-sm"
				disabled={loading}
			>
				{loading ? 'Saving...' : 'Add task'}
			</button>
		</form>
	);
}

function parseTags(input: string): string[] {
	return input
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean);
}
