/**
 * Mock data for crm-pipeline handlers
 */

// ============ Types for Mock Data ============

export interface MockDeal {
  id: string;
  name: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  status: 'OPEN' | 'WON' | 'LOST' | 'STALE';
  contactId?: string;
  companyId?: string;
  ownerId: string;
  expectedCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockStage {
  id: string;
  name: string;
  position: number;
  pipelineId: string;
}

// ============ Pipeline Stages Mock Data ============

export const MOCK_STAGES: MockStage[] = [
  { id: 'stage-1', name: 'Lead', position: 1, pipelineId: 'pipeline-1' },
  { id: 'stage-2', name: 'Qualified', position: 2, pipelineId: 'pipeline-1' },
  { id: 'stage-3', name: 'Proposal', position: 3, pipelineId: 'pipeline-1' },
  { id: 'stage-4', name: 'Negotiation', position: 4, pipelineId: 'pipeline-1' },
  { id: 'stage-5', name: 'Closed', position: 5, pipelineId: 'pipeline-1' },
];

// ============ Deal Mock Data ============

export const MOCK_DEALS: MockDeal[] = [
  {
    id: 'deal-1',
    name: 'Enterprise License - Acme Corp',
    value: 75000,
    currency: 'USD',
    pipelineId: 'pipeline-1',
    stageId: 'stage-3',
    status: 'OPEN',
    contactId: 'contact-1',
    companyId: 'company-1',
    ownerId: 'user-1',
    expectedCloseDate: new Date('2024-05-15T00:00:00Z'),
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-04-10T14:30:00Z'),
  },
  {
    id: 'deal-2',
    name: 'Startup Plan - TechStart Inc',
    value: 12000,
    currency: 'USD',
    pipelineId: 'pipeline-1',
    stageId: 'stage-2',
    status: 'OPEN',
    contactId: 'contact-2',
    companyId: 'company-2',
    ownerId: 'user-2',
    expectedCloseDate: new Date('2024-04-30T00:00:00Z'),
    createdAt: new Date('2024-03-15T09:00:00Z'),
    updatedAt: new Date('2024-04-08T11:15:00Z'),
  },
  {
    id: 'deal-3',
    name: 'Professional Services - Global Ltd',
    value: 45000,
    currency: 'USD',
    pipelineId: 'pipeline-1',
    stageId: 'stage-4',
    status: 'OPEN',
    contactId: 'contact-3',
    companyId: 'company-3',
    ownerId: 'user-1',
    expectedCloseDate: new Date('2024-04-20T00:00:00Z'),
    createdAt: new Date('2024-01-20T08:00:00Z'),
    updatedAt: new Date('2024-04-12T16:45:00Z'),
  },
  {
    id: 'deal-4',
    name: 'Annual Contract - SmallBiz Co',
    value: 8500,
    currency: 'USD',
    pipelineId: 'pipeline-1',
    stageId: 'stage-1',
    status: 'OPEN',
    contactId: 'contact-4',
    companyId: 'company-4',
    ownerId: 'user-3',
    createdAt: new Date('2024-04-05T12:00:00Z'),
    updatedAt: new Date('2024-04-05T12:00:00Z'),
  },
  {
    id: 'deal-5',
    name: 'Custom Integration - MegaCorp',
    value: 125000,
    currency: 'USD',
    pipelineId: 'pipeline-1',
    stageId: 'stage-5',
    status: 'WON',
    contactId: 'contact-5',
    companyId: 'company-5',
    ownerId: 'user-1',
    expectedCloseDate: new Date('2024-03-31T00:00:00Z'),
    createdAt: new Date('2023-11-10T10:00:00Z'),
    updatedAt: new Date('2024-03-28T09:00:00Z'),
  },
  {
    id: 'deal-6',
    name: 'Pilot Project - NewCo',
    value: 5000,
    currency: 'USD',
    pipelineId: 'pipeline-1',
    stageId: 'stage-2',
    status: 'LOST',
    contactId: 'contact-6',
    companyId: 'company-6',
    ownerId: 'user-2',
    createdAt: new Date('2024-01-15T14:00:00Z'),
    updatedAt: new Date('2024-02-28T10:30:00Z'),
  },
];

// ============ Company Mock Data ============

export const MOCK_COMPANIES = [
  {
    id: 'company-1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    industry: 'Technology',
    size: '1000-5000',
    website: 'https://acme.com',
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: 'company-2',
    name: 'TechStart Inc',
    domain: 'techstart.io',
    industry: 'Software',
    size: '10-50',
    website: 'https://techstart.io',
    createdAt: new Date('2024-02-15T00:00:00Z'),
  },
  {
    id: 'company-3',
    name: 'Global Ltd',
    domain: 'global.com',
    industry: 'Consulting',
    size: '500-1000',
    website: 'https://global.com',
    createdAt: new Date('2023-12-01T00:00:00Z'),
  },
];

// ============ Contact Mock Data ============

export const MOCK_CONTACTS = [
  {
    id: 'contact-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acme.com',
    phone: '+1-555-0101',
    title: 'VP of Engineering',
    companyId: 'company-1',
    createdAt: new Date('2024-01-05T00:00:00Z'),
  },
  {
    id: 'contact-2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@techstart.io',
    phone: '+1-555-0102',
    title: 'CEO',
    companyId: 'company-2',
    createdAt: new Date('2024-02-20T00:00:00Z'),
  },
  {
    id: 'contact-3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@global.com',
    phone: '+1-555-0103',
    title: 'CTO',
    companyId: 'company-3',
    createdAt: new Date('2023-12-10T00:00:00Z'),
  },
];
