import { defineCapability } from '../../capabilities';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneApprovalCapability = defineCapability({
  meta: {
    key: 'control-plane.approval',
    version: '1.0.0',
    kind: 'integration',
    title: 'Control Plane Approval',
    description: 'Human approval and rejection gates for execution steps.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'approval'],
    stability: CONTROL_PLANE_STABILITY,
  },
  requires: [
    {
      key: 'control-plane.core',
      version: '1.0.0',
      reason: 'Approval decisions are applied on core execution records.',
    },
  ],
  provides: [
    {
      surface: 'operation',
      key: 'controlPlane.execution.approve',
      version: '1.0.0',
      description: 'Approve a pending step.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.execution.reject',
      version: '1.0.0',
      description: 'Reject a pending step.',
    },
    {
      surface: 'event',
      key: 'controlPlane.execution.step.blocked',
      version: '1.0.0',
      description: 'Step blocked by policy or operator decision.',
    },
  ],
});
