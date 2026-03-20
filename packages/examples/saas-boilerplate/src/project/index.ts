/**
 * Project domain - project management within organizations.
 */

// Entities
export {
	ProjectEntity,
	ProjectMemberEntity,
	ProjectStatusEnum,
} from './project.entity';
// Enums
export {
	ProjectStatusFilterEnum,
	ProjectStatusSchemaEnum,
} from './project.enum';
// Events
export {
	ProjectArchivedEvent,
	ProjectCreatedEvent,
	ProjectDeletedEvent,
	ProjectUpdatedEvent,
} from './project.event';
// Handlers
export {
	type CreateProjectInput,
	type ListProjectsInput,
	type ListProjectsOutput,
	mockCreateProjectHandler,
	mockDeleteProjectHandler,
	mockGetProjectHandler,
	mockListProjectsHandler,
	mockUpdateProjectHandler,
	type Project,
	type UpdateProjectInput,
} from './project.handler';
// Contracts
export {
	CreateProjectContract,
	DeleteProjectContract,
	GetProjectContract,
	ListProjectsContract,
	UpdateProjectContract,
} from './project.operations';

// Presentations
export {
	ProjectDetailPresentation,
	ProjectListPresentation,
} from './project.presentation';
// Schema models
export {
	CreateProjectInputModel,
	DeleteProjectInputModel,
	DeleteProjectOutputModel,
	GetProjectInputModel,
	ListProjectsInputModel,
	ListProjectsOutputModel,
	ProjectDeletedPayloadModel,
	ProjectModel,
	UpdateProjectInputModel,
} from './project.schema';
