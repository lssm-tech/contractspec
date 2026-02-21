import { eq, and } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import {
  organizations,
  orgMembers,
  type Organization,
  type OrgMember,
} from '../db/schema.js';

/** Valid org member roles. */
export type OrgRole = 'owner' | 'admin' | 'member';

/**
 * Service for managing organizations and their members.
 */
export class OrgService {
  constructor(private db: Db) {}

  /**
   * Create a new organization.
   * The creating user becomes the owner.
   */
  async create(input: {
    name: string;
    displayName: string;
    description?: string;
    avatarUrl?: string;
    website?: string;
    ownerUsername: string;
  }): Promise<Organization> {
    const now = new Date().toISOString();

    await this.db.insert(organizations).values({
      name: input.name,
      displayName: input.displayName,
      description: input.description ?? null,
      avatarUrl: input.avatarUrl ?? null,
      website: input.website ?? null,
      createdAt: now,
      updatedAt: now,
    });

    // Add creating user as owner
    await this.db.insert(orgMembers).values({
      orgName: input.name,
      username: input.ownerUsername,
      role: 'owner',
      createdAt: now,
    });

    const organization = await this.get(input.name);
    if (!organization) {
      throw new Error(`Failed to create organization: ${input.name}`);
    }
    return organization;
  }

  /** Get an organization by name. */
  async get(name: string): Promise<Organization | null> {
    const result = await this.db
      .select()
      .from(organizations)
      .where(eq(organizations.name, name))
      .limit(1);
    return result[0] ?? null;
  }

  /** Update organization details. */
  async update(
    name: string,
    updates: Partial<
      Pick<
        Organization,
        'displayName' | 'description' | 'avatarUrl' | 'website'
      >
    >
  ): Promise<Organization | null> {
    await this.db
      .update(organizations)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(organizations.name, name));
    return this.get(name);
  }

  /** Delete an organization. */
  async delete(name: string): Promise<boolean> {
    const result = await this.db
      .delete(organizations)
      .where(eq(organizations.name, name));
    return (result as unknown as { changes: number }).changes > 0;
  }

  /** List members of an organization. */
  async listMembers(orgName: string): Promise<OrgMember[]> {
    return this.db
      .select()
      .from(orgMembers)
      .where(eq(orgMembers.orgName, orgName));
  }

  /** Add a member to an organization. */
  async addMember(
    orgName: string,
    username: string,
    role: OrgRole = 'member'
  ): Promise<OrgMember> {
    const now = new Date().toISOString();

    // Upsert — update role if member already exists
    const existing = await this.db
      .select()
      .from(orgMembers)
      .where(
        and(eq(orgMembers.orgName, orgName), eq(orgMembers.username, username))
      )
      .limit(1);

    if (existing[0]) {
      await this.db
        .update(orgMembers)
        .set({ role })
        .where(eq(orgMembers.id, existing[0].id));
    } else {
      await this.db.insert(orgMembers).values({
        orgName,
        username,
        role,
        createdAt: now,
      });
    }

    const result = await this.db
      .select()
      .from(orgMembers)
      .where(
        and(eq(orgMembers.orgName, orgName), eq(orgMembers.username, username))
      )
      .limit(1);

    const member = result[0];
    if (!member) {
      throw new Error(`Failed to add member ${username} to ${orgName}`);
    }
    return member;
  }

  /** Remove a member from an organization. */
  async removeMember(orgName: string, username: string): Promise<boolean> {
    const result = await this.db
      .delete(orgMembers)
      .where(
        and(eq(orgMembers.orgName, orgName), eq(orgMembers.username, username))
      );
    return (result as unknown as { changes: number }).changes > 0;
  }

  /**
   * Check if a user has a specific role (or higher) in an organization.
   * Role hierarchy: owner > admin > member
   */
  async hasRole(
    orgName: string,
    username: string,
    requiredRole: OrgRole
  ): Promise<boolean> {
    const member = await this.db
      .select()
      .from(orgMembers)
      .where(
        and(eq(orgMembers.orgName, orgName), eq(orgMembers.username, username))
      )
      .limit(1);

    if (!member[0]) return false;

    const hierarchy: Record<OrgRole, number> = {
      owner: 3,
      admin: 2,
      member: 1,
    };

    return hierarchy[member[0].role as OrgRole] >= hierarchy[requiredRole];
  }

  /**
   * Check if a pack name is scoped to an organization (starts with @).
   * Returns the org name if scoped, null otherwise.
   */
  static parseOrgScope(packName: string): string | null {
    if (!packName.startsWith('@')) return null;
    const slashIndex = packName.indexOf('/');
    if (slashIndex === -1) return null;
    return packName.slice(1, slashIndex);
  }

  /**
   * Get all organizations a user belongs to.
   */
  async getUserOrgs(username: string): Promise<OrgMember[]> {
    return this.db
      .select()
      .from(orgMembers)
      .where(eq(orgMembers.username, username));
  }
}
