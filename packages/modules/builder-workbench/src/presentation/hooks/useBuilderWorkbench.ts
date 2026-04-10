'use client';

import type {
	BuilderWorkspace,
	BuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';
import * as React from 'react';

export function useBuilderWorkbenchState(input: {
	workspace: BuilderWorkspace;
	initialSnapshot: BuilderWorkspaceSnapshot;
}) {
	const [promptDraft, setPromptDraft] = React.useState('');
	const [snapshot, setSnapshot] = React.useState(input.initialSnapshot);

	return {
		workspace: input.workspace,
		snapshot,
		setSnapshot,
		promptDraft,
		setPromptDraft,
	};
}
