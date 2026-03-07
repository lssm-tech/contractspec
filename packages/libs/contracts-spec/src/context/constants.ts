import { StabilityEnum, TagsEnum } from '../ownership';

export const CONTEXT_DOMAIN = 'context';
export const CONTEXT_OWNERS = ['platform.context'];
export const CONTEXT_TAGS = [
  TagsEnum.Automation,
  'context',
  'snapshot',
  'knowledge',
];
export const CONTEXT_STABILITY = StabilityEnum.Experimental;
