# @lssm/lib.identity-rbac

Website: https://contractspec.io/


Identity, Organizations, and Role-Based Access Control (RBAC) module for ContractSpec applications.

## Purpose

Provides a reusable identity and authorization foundation for multi-tenant, multi-role applications. This module follows the spec-first approach where entity definitions generate database schemas.

## Features

- **User Management**: User profiles, authentication accounts, sessions
- **Organizations**: Multi-tenant organization support with slugs, metadata
- **Memberships**: Role-based organization membership (owner, admin, member)
- **RBAC**: Roles, permissions, and policy bindings
- **Teams**: Optional team grouping within organizations
- **Events**: Domain events for user/org lifecycle changes

## Installation

```bash
bun add @lssm/lib.identity-rbac
```

## Usage

### Entity Specs (for schema generation)

```typescript
import { UserEntity, OrganizationEntity, MemberEntity } from '@lssm/lib.identity-rbac/entities';

// Use in schema composition
const contribution = {
  moduleId: '@lssm/lib.identity-rbac',
  entities: [UserEntity, OrganizationEntity, MemberEntity, ...],
};
```

### Contracts (for API generation)

```typescript
import { 
  CreateUserContract,
  InviteToOrgContract,
  AssignRoleContract 
} from '@lssm/lib.identity-rbac/contracts';
```

### Policies (for authorization)

```typescript
import { RBACPolicyEngine, Permission } from '@lssm/lib.identity-rbac/policies';

const engine = new RBACPolicyEngine();
const canManage = await engine.checkPermission({
  userId: 'user-123',
  orgId: 'org-456',
  permission: Permission.MANAGE_MEMBERS,
});
```

### Events

```typescript
import { UserCreatedEvent, OrgMemberAddedEvent } from '@lssm/lib.identity-rbac/events';

bus.subscribe(UserCreatedEvent, async (event) => {
  // Handle user creation
});
```

## Entity Overview

| Entity | Description |
|--------|-------------|
| User | Platform user with profile and auth |
| Organization | Tenant/company grouping |
| Member | User's membership in an organization |
| Role | Named set of permissions |
| Permission | Atomic access right |
| PolicyBinding | Binds roles to principals |
| Team | Optional team within organization |

## Schemas

All entities are defined in the `lssm_sigil` PostgreSQL schema for isolation.

## Events

| Event | Trigger |
|-------|---------|
| user.created | New user registered |
| user.updated | User profile changed |
| user.deleted | User account removed |
| org.created | New organization created |
| org.member.added | User joined organization |
| org.member.removed | User left organization |
| role.assigned | Role assigned to user/org |
| role.revoked | Role removed from user/org |

