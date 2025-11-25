import type { LifecycleStage } from '@lssm/lib.lifecycle';
import type { LifecycleAssessmentRequest } from '../services/assessment-service';
import { LifecycleAssessmentService } from '../services/assessment-service';

export interface HttpRequest<
  TBody = unknown,
  TParams = Record<string, string>,
> {
  body?: TBody;
  params?: TParams;
  query?: Record<string, string | undefined>;
}

export interface HttpResponse<T = unknown> {
  status: number;
  body: T;
}

export const createLifecycleHandlers = (
  service: LifecycleAssessmentService
) => ({
  runAssessment: async (
    req: HttpRequest<LifecycleAssessmentRequest>
  ): Promise<HttpResponse> => {
    const payload = req.body ?? {};
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







