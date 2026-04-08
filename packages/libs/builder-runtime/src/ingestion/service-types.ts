import type {
	BuilderSourceRecord,
	EvidenceReference,
} from '@contractspec/lib.builder-spec';
import { compileDirectiveCandidates } from './directives';
import { extractBuilderSourceParts } from './extractor';

export interface BuilderIngestionServiceOptions {
	now?: () => Date;
	approvedVoiceLocales?: string[];
	retainRawAudioPolicy?: 'disabled' | 'tenant-configurable' | 'always';
}

export interface BuilderAssetIngestionResult {
	source: BuilderSourceRecord;
	childSources?: BuilderSourceRecord[];
	directives: ReturnType<typeof compileDirectiveCandidates>;
	parts: Array<
		Awaited<ReturnType<typeof extractBuilderSourceParts>>['parts'][number]
	>;
	evidenceReferences?: EvidenceReference[];
}
