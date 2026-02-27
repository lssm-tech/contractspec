import { defineCapability } from '../../capabilities';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneAuditCapability = defineCapability({
  meta: {
    key: 'control-plane.audit',
    version: '1.0.0',
    kind: 'data',
    title: 'Control Plane Audit',
    description: 'Trace, policy explanation, and replay-grade observability.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'audit'],
    stability: CONTROL_PLANE_STABILITY,
  },
  requires: [
    {
      key: 'control-plane.core',
      version: '1.0.0',
      reason: 'Audit surfaces depend on core execution lifecycle records.',
    },
  ],
  provides: [
    {
      surface: 'operation',
      key: 'controlPlane.plan.verify',
      version: '1.0.0',
      description: 'Verify plan policy/risk before execution.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.trace.get',
      version: '1.0.0',
      description: 'Get trace entries for replay and investigations.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.policy.explain',
      version: '1.0.0',
      description: 'Explain policy verdict rationale.',
    },
    {
      surface: 'event',
      key: 'controlPlane.execution.failed',
      version: '1.0.0',
      description: 'Execution failure event for incident tracking.',
    },
    {
      surface: 'event',
      key: 'controlPlane.execution.completed',
      version: '1.0.0',
      description: 'Execution completion event for reporting.',
    },
  ],
});
