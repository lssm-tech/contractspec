import { describe, test, expect, beforeEach } from 'bun:test';
import { createTestDb, type TestDb } from './db-fixture.js';
import { PackService } from '../src/services/pack-service.js';
import { SearchService } from '../src/services/search-service.js';

describe('SearchService', () => {
  let db: TestDb;
  let packService: PackService;
  let searchService: SearchService;

  beforeEach(async () => {
    db = createTestDb();
    packService = new PackService(db as any);
    searchService = new SearchService(db as any);

    // Seed some packs
    await packService.create({
      name: 'typescript-rules',
      displayName: 'TypeScript Rules',
      description: 'Best practices for TypeScript',
      authorName: 'alice',
      tags: ['typescript', 'rules'],
      targets: ['opencode', 'cursor'],
      features: ['rules', 'commands'],
      downloads: 100,
      weeklyDownloads: 10,
    });

    await packService.create({
      name: 'react-patterns',
      displayName: 'React Patterns',
      description: 'Component patterns for React',
      authorName: 'bob',
      tags: ['react', 'frontend'],
      targets: ['opencode', 'copilot'],
      features: ['rules', 'agents'],
      downloads: 200,
      weeklyDownloads: 20,
    });

    await packService.create({
      name: 'security-pack',
      displayName: 'Security Pack',
      description: 'Security auditing rules',
      authorName: 'alice',
      tags: ['security', 'audit'],
      targets: ['cursor', 'claude-code'],
      features: ['rules', 'agents', 'commands'],
      downloads: 50,
      weeklyDownloads: 5,
    });
  });

  test('search by query text', async () => {
    const result = await searchService.search({ q: 'typescript' });
    expect(result.packs).toHaveLength(1);
    expect(result.packs[0]!.name).toBe('typescript-rules');
  });

  test('search by partial description', async () => {
    const result = await searchService.search({ q: 'patterns' });
    expect(result.packs).toHaveLength(1);
    expect(result.packs[0]!.name).toBe('react-patterns');
  });

  test('search with no query returns all', async () => {
    const result = await searchService.search({});
    expect(result.total).toBe(3);
  });

  test('search respects limit and offset', async () => {
    const result = await searchService.search({ limit: 2, offset: 0 });
    expect(result.packs).toHaveLength(2);
    expect(result.total).toBe(3);
  });

  test('search by author', async () => {
    const result = await searchService.search({ author: 'alice' });
    expect(result.packs).toHaveLength(2);
  });

  test('search sort by downloads', async () => {
    const result = await searchService.search({ sort: 'downloads' });
    expect(result.packs[0]!.name).toBe('react-patterns');
    expect(result.packs[0]!.downloads).toBe(200);
  });

  test('search sort by name', async () => {
    const result = await searchService.search({ sort: 'name' });
    expect(result.packs[0]!.name).toBe('react-patterns');
  });

  test('getTags returns unique tags with counts', async () => {
    const tags = await searchService.getTags();
    expect(tags.length).toBeGreaterThan(0);
    // Each pack has 2 tags, all unique
    expect(tags.length).toBe(6);
  });

  test('getByTarget returns matching packs', async () => {
    const result = await searchService.getByTarget('opencode');
    expect(result).toHaveLength(2);
  });

  test('getByTarget returns empty for unknown target', async () => {
    const result = await searchService.getByTarget('unknown-target');
    expect(result).toHaveLength(0);
  });

  test('getStats returns correct counts', async () => {
    const stats = await searchService.getStats();
    expect(stats.totalPacks).toBe(3);
    expect(stats.totalDownloads).toBe(350);
  });
});
