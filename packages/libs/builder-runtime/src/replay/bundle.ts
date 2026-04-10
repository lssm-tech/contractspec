import type {
	BuilderBlueprint,
	BuilderChannelMessage,
	BuilderDirectiveCandidate,
	BuilderReadinessReport,
	BuilderSourceRecord,
} from '@contractspec/lib.builder-spec';
import { sha256 } from '../utils/hash';

export interface BuilderReplayBundle {
	version: '1';
	createdAt: string;
	workspaceId: string;
	blueprintVersion: number;
	sourceSetHash: string;
	sourceIds: string[];
	directiveIds: string[];
	messageIds: string[];
	readinessReportId?: string;
}

export function createBuilderReplayBundle(input: {
	workspaceId: string;
	blueprint: BuilderBlueprint;
	sources: BuilderSourceRecord[];
	directives: BuilderDirectiveCandidate[];
	messages: BuilderChannelMessage[];
	readinessReport?: BuilderReadinessReport | null;
	now?: () => Date;
}): BuilderReplayBundle {
	const sourceSetHash = sha256(
		JSON.stringify(
			input.sources
				.map((source) => `${source.id}:${source.hash}:${source.updatedAt}`)
				.sort()
		)
	);
	return {
		version: '1',
		createdAt: (input.now?.() ?? new Date()).toISOString(),
		workspaceId: input.workspaceId,
		blueprintVersion: input.blueprint.version,
		sourceSetHash,
		sourceIds: input.sources.map((source) => source.id),
		directiveIds: input.directives.map((directive) => directive.id),
		messageIds: input.messages.map((message) => message.id),
		readinessReportId: input.readinessReport?.id,
	};
}
