/**
 * Mock data for saas-boilerplate handlers
 */

// ============ Project Mock Data ============

export const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Marketing Website',
    description: 'Main company website redesign project',
    slug: 'marketing-website',
    organizationId: 'demo-org',
    createdBy: 'user-1',
    status: 'ACTIVE' as const,
    isPublic: false,
    tags: ['marketing', 'website', 'redesign'],
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-03-20T14:30:00Z'),
  },
  {
    id: 'proj-2',
    name: 'Mobile App v2',
    description: 'Next generation mobile application',
    slug: 'mobile-app-v2',
    organizationId: 'demo-org',
    createdBy: 'user-2',
    status: 'ACTIVE' as const,
    isPublic: false,
    tags: ['mobile', 'app', 'v2'],
    createdAt: new Date('2024-02-01T09:00:00Z'),
    updatedAt: new Date('2024-04-05T11:15:00Z'),
  },
  {
    id: 'proj-3',
    name: 'API Integration',
    description: 'Third-party API integration project',
    slug: 'api-integration',
    organizationId: 'demo-org',
    createdBy: 'user-1',
    status: 'DRAFT' as const,
    isPublic: false,
    tags: ['api', 'integration'],
    createdAt: new Date('2024-03-10T08:00:00Z'),
    updatedAt: new Date('2024-03-10T08:00:00Z'),
  },
  {
    id: 'proj-4',
    name: 'Analytics Dashboard',
    description: 'Internal analytics and reporting dashboard',
    slug: 'analytics-dashboard',
    organizationId: 'demo-org',
    createdBy: 'user-3',
    status: 'ARCHIVED' as const,
    isPublic: true,
    tags: ['analytics', 'dashboard', 'reporting'],
    createdAt: new Date('2023-10-01T12:00:00Z'),
    updatedAt: new Date('2024-02-28T16:45:00Z'),
  },
];

// ============ Subscription Mock Data ============

export const MOCK_SUBSCRIPTION = {
  id: 'sub-1',
  organizationId: 'demo-org',
  planId: 'pro',
  planName: 'Professional',
  status: 'ACTIVE' as const,
  currentPeriodStart: new Date('2024-04-01T00:00:00Z'),
  currentPeriodEnd: new Date('2024-05-01T00:00:00Z'),
  limits: {
    projects: 25,
    users: 10,
    storage: 50, // GB
    apiCalls: 100000,
  },
  usage: {
    projects: 4,
    users: 5,
    storage: 12.5,
    apiCalls: 45230,
  },
};

// ============ Usage Summary Mock Data ============

export const MOCK_USAGE_SUMMARY = {
  organizationId: 'demo-org',
  period: 'current_month',
  apiCalls: {
    total: 45230,
    limit: 100000,
    percentUsed: 45.23,
  },
  storage: {
    totalGb: 12.5,
    limitGb: 50,
    percentUsed: 25,
  },
  activeProjects: 4,
  activeUsers: 5,
  breakdown: [
    { date: '2024-04-01', apiCalls: 3200, storageGb: 12.1 },
    { date: '2024-04-02', apiCalls: 2800, storageGb: 12.2 },
    { date: '2024-04-03', apiCalls: 4100, storageGb: 12.3 },
    { date: '2024-04-04', apiCalls: 3600, storageGb: 12.4 },
    { date: '2024-04-05', apiCalls: 3800, storageGb: 12.5 },
  ],
};
