/**
 * Project domain - project management within organizations.
 */

// Enums
export {
  ProjectStatusSchemaEnum,
  ProjectStatusFilterEnum,
} from './project.enum';

// Schema models
export {
  ProjectModel,
  CreateProjectInputModel,
  UpdateProjectInputModel,
  GetProjectInputModel,
  DeleteProjectInputModel,
  DeleteProjectOutputModel,
  ProjectDeletedPayloadModel,
  ListProjectsInputModel,
  ListProjectsOutputModel,
} from './project.schema';

// Contracts
export {
  CreateProjectContract,
  GetProjectContract,
  UpdateProjectContract,
  DeleteProjectContract,
  ListProjectsContract,
} from './project.contracts';

// Events
export {
  ProjectCreatedEvent,
  ProjectUpdatedEvent,
  ProjectDeletedEvent,
  ProjectArchivedEvent,
} from './project.event';

// Entities
export {
  ProjectStatusEnum,
  ProjectEntity,
  ProjectMemberEntity,
} from './project.entity';

// Presentations
export {
  ProjectListPresentation,
  ProjectDetailPresentation,
} from './project.presentation';

// Handlers
export {
  mockListProjectsHandler,
  mockGetProjectHandler,
  mockCreateProjectHandler,
  mockUpdateProjectHandler,
  mockDeleteProjectHandler,
  type Project,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ListProjectsInput,
  type ListProjectsOutput,
} from './project.handler';
