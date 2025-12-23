/**
 * Mock handlers for Project contracts.
 */
import { MOCK_PROJECTS } from '../shared/mock-data';

// Types inferred from contract schemas
export interface Project {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  organizationId: string;
  createdBy: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  slug?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateProjectInput {
  projectId: string;
  name?: string;
  description?: string;
  slug?: string;
  isPublic?: boolean;
  tags?: string[];
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'DELETED';
}

export interface ListProjectsInput {
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListProjectsOutput {
  projects: Project[];
  total: number;
}

/**
 * Mock handler for ListProjectsContract.
 */
export async function mockListProjectsHandler(
  input: ListProjectsInput
): Promise<ListProjectsOutput> {
  const { status, search, limit = 20, offset = 0 } = input;

  let filtered = [...MOCK_PROJECTS];

  if (status && status !== 'all') {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const total = filtered.length;
  const projects = filtered.slice(offset, offset + limit);

  return {
    projects,
    total,
  };
}

/**
 * Mock handler for GetProjectContract.
 */
export async function mockGetProjectHandler(input: {
  projectId: string;
}): Promise<Project> {
  const project = MOCK_PROJECTS.find((p) => p.id === input.projectId);

  if (!project) {
    throw new Error('NOT_FOUND');
  }

  return project;
}

/**
 * Mock handler for CreateProjectContract.
 */
export async function mockCreateProjectHandler(
  input: CreateProjectInput,
  context: { organizationId: string; userId: string }
): Promise<Project> {
  if (input.slug) {
    const exists = MOCK_PROJECTS.some((p) => p.slug === input.slug);
    if (exists) {
      throw new Error('SLUG_EXISTS');
    }
  }

  const now = new Date();
  return {
    id: `proj-${Date.now()}`,
    name: input.name,
    description: input.description,
    slug: input.slug ?? input.name.toLowerCase().replace(/\s+/g, '-'),
    organizationId: context.organizationId,
    createdBy: context.userId,
    status: 'DRAFT',
    isPublic: input.isPublic ?? false,
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Mock handler for UpdateProjectContract.
 */
export async function mockUpdateProjectHandler(
  input: UpdateProjectInput
): Promise<Project> {
  const project = MOCK_PROJECTS.find((p) => p.id === input.projectId);

  if (!project) {
    throw new Error('NOT_FOUND');
  }

  return {
    ...project,
    name: input.name ?? project.name,
    description: input.description ?? project.description,
    slug: input.slug ?? project.slug,
    isPublic: input.isPublic ?? project.isPublic,
    tags: input.tags ?? project.tags,
    status: input.status ?? project.status,
    updatedAt: new Date(),
  };
}

/**
 * Mock handler for DeleteProjectContract.
 */
export async function mockDeleteProjectHandler(input: {
  projectId: string;
}): Promise<{ success: boolean }> {
  const project = MOCK_PROJECTS.find((p) => p.id === input.projectId);

  if (!project) {
    throw new Error('NOT_FOUND');
  }

  return { success: true };
}
