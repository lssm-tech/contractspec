import type {
	BuilderAssumption,
	BuilderBlueprint,
	BuilderConflict,
	BuilderDecisionReceipt,
	BuilderDirectiveCandidate,
	BuilderFusionGraphEdge,
} from '@contractspec/lib.builder-spec';

export interface RankedDirective {
	directive: BuilderDirectiveCandidate;
	score: number;
}

export interface BuilderFusionResolution {
	blueprint: BuilderBlueprint;
	assumptions: BuilderAssumption[];
	conflicts: BuilderConflict[];
	decisionReceipts: BuilderDecisionReceipt[];
	fusionGraphEdges: BuilderFusionGraphEdge[];
}
