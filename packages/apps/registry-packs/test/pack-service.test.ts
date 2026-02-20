import { describe, test, expect, beforeEach } from 'bun:test';
import { createTestDb, type TestDb } from './db-fixture.js';
import { PackService } from '../src/services/pack-service.js';

describe('PackService', () => {
  let db: TestDb;
  let service: PackService;

  beforeEach(() => {
    db = createTestDb();
    // PackService expects a Db type which matches our test DB
    service = new PackService(db as any);
  });

  test('create and get a pack', async () => {
    const pack = await service.create({
      name: 'test-pack',
      displayName: 'Test Pack',
      description: 'A test pack',
      authorName: 'tester',
    });

    expect(pack.name).toBe('test-pack');
    expect(pack.displayName).toBe('Test Pack');
    expect(pack.authorName).toBe('tester');

    const found = await service.get('test-pack');
    expect(found).not.toBeNull();
    expect(found!.name).toBe('test-pack');
  });

  test('get returns null for missing pack', async () => {
    const result = await service.get('nonexistent');
    expect(result).toBeNull();
  });

  test('list packs with pagination', async () => {
    for (let i = 0; i < 5; i++) {
      await service.create({
        name: `pack-${i}`,
        displayName: `Pack ${i}`,
        description: `Description ${i}`,
        authorName: 'tester',
      });
    }

    const { packs, total } = await service.list({ limit: 3, offset: 0 });
    expect(packs).toHaveLength(3);
    expect(total).toBe(5);

    const page2 = await service.list({ limit: 3, offset: 3 });
    expect(page2.packs).toHaveLength(2);
  });

  test('update a pack', async () => {
    await service.create({
      name: 'update-test',
      displayName: 'Update Test',
      description: 'Original',
      authorName: 'tester',
    });

    const updated = await service.update('update-test', {
      description: 'Updated description',
      tags: ['new-tag'],
    });

    expect(updated).not.toBeNull();
    expect(updated!.description).toBe('Updated description');
    expect(updated!.tags).toEqual(['new-tag']);
  });

  test('delete a pack', async () => {
    await service.create({
      name: 'delete-me',
      displayName: 'Delete Me',
      description: 'Will be deleted',
      authorName: 'tester',
    });

    const deleted = await service.delete('delete-me');
    expect(deleted).toBe(true);

    const found = await service.get('delete-me');
    expect(found).toBeNull();
  });

  test('delete returns false for missing pack', async () => {
    const deleted = await service.delete('nonexistent');
    expect(deleted).toBe(false);
  });

  test('featured packs', async () => {
    await service.create({
      name: 'featured-pack',
      displayName: 'Featured',
      description: 'A featured pack',
      authorName: 'tester',
      featured: true,
    });

    await service.create({
      name: 'regular-pack',
      displayName: 'Regular',
      description: 'A regular pack',
      authorName: 'tester',
      featured: false,
    });

    const featuredPacks = await service.featured();
    expect(featuredPacks).toHaveLength(1);
    expect(featuredPacks[0]!.name).toBe('featured-pack');
  });

  test('increment downloads', async () => {
    await service.create({
      name: 'dl-pack',
      displayName: 'DL Pack',
      description: 'Test downloads',
      authorName: 'tester',
    });

    await service.incrementDownloads('dl-pack');
    await service.incrementDownloads('dl-pack');

    const pack = await service.get('dl-pack');
    expect(pack!.downloads).toBe(2);
    expect(pack!.weeklyDownloads).toBe(2);
  });

  test('set and get readme', async () => {
    await service.create({
      name: 'readme-pack',
      displayName: 'Readme Pack',
      description: 'Has a readme',
      authorName: 'tester',
    });

    await service.setReadme('readme-pack', '# Hello\n\nWorld');
    const readme = await service.getReadme('readme-pack');
    expect(readme).toBe('# Hello\n\nWorld');
  });

  test('getReadme returns null for missing', async () => {
    const readme = await service.getReadme('no-such-pack');
    expect(readme).toBeNull();
  });

  test('setReadme upserts on conflict', async () => {
    await service.create({
      name: 'upsert-readme',
      displayName: 'Upsert Readme',
      description: 'Test upsert',
      authorName: 'tester',
    });

    await service.setReadme('upsert-readme', 'v1');
    await service.setReadme('upsert-readme', 'v2');
    const readme = await service.getReadme('upsert-readme');
    expect(readme).toBe('v2');
  });
});
