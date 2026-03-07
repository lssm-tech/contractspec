import { defineCapability } from '../../capabilities';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneSkillRegistryCapability = defineCapability({
  meta: {
    key: 'control-plane.skill-registry',
    version: '1.0.0',
    kind: 'integration',
    title: 'Control Plane Skill Registry',
    description: 'Signed skill lifecycle and compatibility governance.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'skills'],
    stability: CONTROL_PLANE_STABILITY,
  },
  provides: [
    {
      surface: 'operation',
      key: 'controlPlane.skill.install',
      version: '1.0.0',
      description: 'Install signed skill artifacts.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.skill.disable',
      version: '1.0.0',
      description: 'Disable installed skill artifacts.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.skill.list',
      version: '1.0.0',
      description: 'List installed skill artifacts.',
    },
    {
      surface: 'operation',
      key: 'controlPlane.skill.verify',
      version: '1.0.0',
      description: 'Verify skill signatures and constraints.',
    },
    {
      surface: 'event',
      key: 'controlPlane.skill.installed',
      version: '1.0.0',
      description: 'Skill install succeeded.',
    },
    {
      surface: 'event',
      key: 'controlPlane.skill.rejected',
      version: '1.0.0',
      description: 'Skill install rejected.',
    },
  ],
});
