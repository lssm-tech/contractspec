import type { LifecycleStage } from '@contractspec/lib.lifecycle';
import type {
	LifecycleAssessmentRequest,
	LifecycleAssessmentResponse,
} from '../services/assessment-service';
import { LifecycleAssessmentService } from '../services/assessment-service';

/** Authenticated caller context attached by middleware. */
export interface AuthContext {
	actor: string;
	authMethod?: string;
	scopes?: string[];
}

/** Transport/auth preferences extracted from the request. */
export interface TransportAuthPreferences {
	preferredTransport?: 'rest' | 'mcp' | 'webhook' | 'sdk';
	preferredAuthMethod?:
		| 'api-key'
		| 'oauth2'
		| 'bearer'
		| 'header'
		| 'basic'
		| 'webhook-signing'
		| 'service-account';
}

export interface HttpRequest<
	TBody = unknown,
	TParams = Record<string, string>,
> {
	body?: TBody;
	params?: TParams;
	query?: Record<string, string | undefined>;
	/** Authenticated caller context, populated by auth middleware. */
	authContext?: AuthContext;
	/** Transport/auth preferences from the request. */
	transportPreferences?: TransportAuthPreferences;
}

export interface HttpResponse<T = Record<string, unknown>> {
	status: number;
	body: T;
}

export const createLifecycleHandlers = (
	service: LifecycleAssessmentService
) => ({
	runAssessment: async (
		req: HttpRequest<LifecycleAssessmentRequest>
	): Promise<HttpResponse<LifecycleAssessmentResponse>> => {
		const payload: LifecycleAssessmentRequest = {
			...(req.body ?? {}),
			transport:
				req.body?.transport ?? req.transportPreferences?.preferredTransport,
			authMethod:
				req.body?.authMethod ?? req.transportPreferences?.preferredAuthMethod,
		};
		const result = await service.runAssessment(payload);
		return { status: 200, body: result };
	},
	getPlaybook: async (
		req: HttpRequest<unknown, { stage: string }>
	): Promise<HttpResponse> => {
		const stage = Number(req.params?.stage ?? 0) as LifecycleStage;
		const result = service.getStagePlaybook(stage);
		return { status: 200, body: result };
	},
});
