// Contact entities
export { ContactStatusEnum, ContactEntity } from './contact';

// Company entities
export { CompanySizeEnum, CompanyEntity } from './company';

// Deal entities
export {
  DealStatusEnum,
  PipelineEntity,
  StageEntity,
  DealEntity,
} from './deal';

// Task entities
export {
  TaskTypeEnum,
  TaskPriorityEnum,
  TaskStatusEnum,
  TaskEntity,
  ActivityEntity,
} from './task';

// Schema contribution
import { ContactEntity, ContactStatusEnum } from './contact';
import { CompanyEntity, CompanySizeEnum } from './company';
import {
  PipelineEntity,
  StageEntity,
  DealEntity,
  DealStatusEnum,
} from './deal';
import {
  TaskEntity,
  ActivityEntity,
  TaskTypeEnum,
  TaskPriorityEnum,
  TaskStatusEnum,
} from './task';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

export const crmPipelineEntities = [
  ContactEntity,
  CompanyEntity,
  PipelineEntity,
  StageEntity,
  DealEntity,
  TaskEntity,
  ActivityEntity,
];

export const crmPipelineSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/example.crm-pipeline',
  entities: crmPipelineEntities,
  enums: [
    ContactStatusEnum,
    CompanySizeEnum,
    DealStatusEnum,
    TaskTypeEnum,
    TaskPriorityEnum,
    TaskStatusEnum,
  ],
};
