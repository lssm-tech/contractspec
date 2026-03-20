import { StabilityEnum, TagsEnum } from '../ownership';

export const DATABASE_DOMAIN = 'database';
export const DATABASE_OWNERS = ['platform.data'];
export const DATABASE_TAGS = [
	TagsEnum.Automation,
	'database',
	'schema',
	'migrations',
];
export const DATABASE_STABILITY = StabilityEnum.Experimental;
