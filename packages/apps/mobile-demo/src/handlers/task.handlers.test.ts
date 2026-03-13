import { describe, expect, it, beforeEach } from 'bun:test';
import { taskRegistry, resetTaskStoreForTesting } from './task.handlers';

beforeEach(() => {
  resetTaskStoreForTesting();
});

describe('task.handlers', () => {
  describe('task.list', () => {
    it('returns empty array initially', async () => {
      const result = await taskRegistry.execute('task.list', '1.0.0', {}, {});
      expect(result).toEqual({ tasks: [] });
    });
  });

  describe('task.create', () => {
    it('rejects empty title', async () => {
      await expect(
        taskRegistry.execute('task.create', '1.0.0', { title: '   ' }, {})
      ).rejects.toThrow('Title must be 1–500 characters');
    });

    it('rejects title over 500 characters', async () => {
      await expect(
        taskRegistry.execute(
          'task.create',
          '1.0.0',
          { title: 'x'.repeat(501) },
          {}
        )
      ).rejects.toThrow('Title must be 1–500 characters');
    });

    it('trims title', async () => {
      const created = await taskRegistry.execute(
        'task.create',
        '1.0.0',
        { title: '  Buy milk  ' },
        {}
      );
      expect(created).toMatchObject({ title: 'Buy milk' });
    });

    it('adds task and returns it', async () => {
      const created = await taskRegistry.execute(
        'task.create',
        '1.0.0',
        { title: 'Buy milk' },
        {}
      );
      expect(created).toMatchObject({
        title: 'Buy milk',
        done: false,
      });
      expect(created).toHaveProperty('id');
      expect(typeof (created as { id: string }).id).toBe('string');

      const list = await taskRegistry.execute('task.list', '1.0.0', {}, {});
      expect(list).toEqual({ tasks: [created] });
    });
  });

  describe('task.updateStatus', () => {
    it('toggles done', async () => {
      const created = await taskRegistry.execute(
        'task.create',
        '1.0.0',
        { title: 'Test' },
        {}
      );
      const id = (created as { id: string }).id;

      const updated = await taskRegistry.execute(
        'task.updateStatus',
        '1.0.0',
        { id, done: true },
        {}
      );
      expect(updated).toMatchObject({ id, done: true });

      const toggledBack = await taskRegistry.execute(
        'task.updateStatus',
        '1.0.0',
        { id, done: false },
        {}
      );
      expect(toggledBack).toMatchObject({ id, done: false });
    });

    it('throws for unknown id', async () => {
      await expect(
        taskRegistry.execute(
          'task.updateStatus',
          '1.0.0',
          { id: 'task-999', done: true },
          {}
        )
      ).rejects.toThrow('Task not found: task-999');
    });
  });
});
