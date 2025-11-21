import {
  ComplianceBadgeStatus,
  DocumentStatus,
  getDatamodel,
  OrganizationType,
  type PothosPrismaTypes,
  prisma,
} from '@lssm/app.cli-database-strit';
import { createPrismaSchemaBuilder } from '@lssm/lib.graphql-prisma';
import { createLoggerTracing } from '@lssm/lib.graphql-prisma';
import type { Context } from './types';

interface SellerComplianceData {
  sellerId: string;
  badge: ComplianceBadgeStatus;
  missingCore: boolean;
  expiring: boolean;
  uploadedCount: number;
  hasVerifiedKBIS?: boolean;
  hasVerifiedUser?: boolean;
}

interface UserKycStatusData {
  phoneVerified: boolean;
  hasVerifiedIdDocument: boolean;
  isVerified: boolean;
}

interface SellerKycStatusData {
  hasVerifiedKBIS: boolean;
  hasVerifiedUser: boolean;
  isVerified: boolean;
}

export const gqlSchemaBuilder = createPrismaSchemaBuilder<
  Context,
  PothosPrismaTypes,
  {
    SellerCompliance: SellerComplianceData;
    UserKycStatus: UserKycStatusData;
    SellerKycStatus: SellerKycStatusData;
  },
  {
    ComplianceBadgeStatus: {
      Input: ComplianceBadgeStatus;
      Output: ComplianceBadgeStatus;
    };
    OrganizationType: { Input: OrganizationType; Output: OrganizationType };
    DocumentStatus: { Input: DocumentStatus; Output: DocumentStatus };
    DocumentType: { Input: DocumentType; Output: DocumentType };
  }
>({
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
    onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
  },
  complexity: {
    defaultComplexity: 1,
    defaultListMultiplier: 10,
  },
  tracing: createLoggerTracing({
    info: (msg: string, meta?: unknown) =>
      console.log(msg, meta as Record<string, any>),
  }),
  federation: true,
});

export type StritSchemaBuilder = typeof gqlSchemaBuilder;
