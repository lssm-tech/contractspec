import { defineCapability } from '../../capabilities';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneCoreCapability = defineCapability({
  meta: {
    key: 'control-plane.core',
    version: '1.0.0',
    kind: 'integration',
    title: 'Control Plane Core',
    description: 'Core intent, planning, and execution surfaces.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'core'],
    stability: CONTROL_PLANE_STABILITY,
  },
  provides: [
    {
      surface: 'operation',
      key: 'controlPlane.intent.submit',
      version: '1.0.0',
      description: 'Submit intent for controlled execution.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.plan.compile',
      version: '1.0.0',
      description: 'Compile deterministic plan DAG.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.execution.start',
      version: '1.0.0',
      description: 'Start approved plan execution.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.execution.cancel',
      version: '1.0.0',
      description: 'Cancel in-flight execution.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.execution.get',
      version: '1.0.0',
      description: 'Read one execution state.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.execution.list',
      version: '1.0.0',
      description: 'List execution states.',
    },
    {
      surface: 'event',
      key: 'controlPlane.intent.received',
      version: '1.0.0',
      description: 'Intent accepted into runtime pipeline.',
    },
    {
      surface: 'event',
      key: 'controlPlane.plan.compiled',
      version: '1.0.0',
      description: 'Plan compilation completed.',
    },
  ],
});
