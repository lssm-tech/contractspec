import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { ContextSystemDocBlock } from '../../../context/capabilities/contextSystem.capability';
import { ContextPackSnapshotDocBlock } from '../../../context/commands/contextPackSnapshot.command';
import { ContextSnapshotCreatedDocBlock } from '../../../context/events/contextSnapshotCreated.event';
import { ContextPackSearchFormDocBlock } from '../../../context/forms/contextPackSearch.form';
import { ContextSnapshotSummaryDocBlock } from '../../../context/presentations/contextSnapshot.presentation';
import { ContextPackDescribeDocBlock } from '../../../context/queries/contextPackDescribe.query';
import { ContextPackSearchDocBlock } from '../../../context/queries/contextPackSearch.query';
import { ContextSnapshotsDataViewDocBlock } from '../../../context/views/contextSnapshots.dataView';

export const tech_context_system_DocBlocks: DocBlock[] = [
	ContextSystemDocBlock,
	ContextPackDescribeDocBlock,
	ContextPackSearchDocBlock,
	ContextPackSnapshotDocBlock,
	ContextSnapshotCreatedDocBlock,
	ContextSnapshotsDataViewDocBlock,
	ContextPackSearchFormDocBlock,
	ContextSnapshotSummaryDocBlock,
];
