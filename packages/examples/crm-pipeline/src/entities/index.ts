export * from './company.entity';
export * from './contact.entity';
export * from './deal.entity';
export * from './task.entity';

import type { ModuleSchemaContribution } from '@contractspec/lib.schema';
import { CompanyEntity, CompanySizeEnum } from './company.entity';
import { ContactEntity, ContactStatusEnum } from './contact.entity';
import {
	DealEntity,
	DealStatusEnum,
	PipelineEntity,
	StageEntity,
} from './deal.entity';
import {
	ActivityEntity,
	TaskEntity,
	TaskPriorityEnum,
	TaskStatusEnum,
	TaskTypeEnum,
} from './task.entity';

/**
 * CRM Pipeline schema contribution.
 */
export const crmPipelineSchemaContribution: ModuleSchemaContribution = {
	moduleId: '@contractspec/example.crm-pipeline',
	entities: [
		CompanyEntity,
		ContactEntity,
		DealEntity,
		PipelineEntity,
		StageEntity,
		TaskEntity,
		ActivityEntity,
	],
	enums: [
		CompanySizeEnum,
		ContactStatusEnum,
		DealStatusEnum,
		TaskTypeEnum,
		TaskPriorityEnum,
		TaskStatusEnum,
	],
};
