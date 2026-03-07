import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';

export const CONTROL_PLANE_DOMAIN = 'control-plane';
export const CONTROL_PLANE_OWNERS = [OwnersEnum.PlatformCore];
export const CONTROL_PLANE_TAGS = [
  TagsEnum.Automation,
  'control-plane',
  'agent-runtime',
];
export const CONTROL_PLANE_STABILITY = StabilityEnum.Experimental;
