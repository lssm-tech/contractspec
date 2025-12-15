export * from './company.entity';
export * from './contact.entity';
export * from './deal.entity';
export * from './task.entity';

import type { ModuleSchemaContribution } from '@lssm/lib.schema';
import { CompanyEntity, CompanySizeEnum } from './company.entity';
import { ContactEntity, ContactStatusEnum } from './contact.entity';
import {
  DealEntity,
  PipelineEntity,
  StageEntity,
  DealStatusEnum,
} from './deal.entity';
import {
  TaskEntity,
  ActivityEntity,
  TaskTypeEnum,
  TaskPriorityEnum,
  TaskStatusEnum,
} from './task.entity';

/**
 * CRM Pipeline schema contribution.
 */
export const crmPipelineSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/example.crm-pipeline',
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
