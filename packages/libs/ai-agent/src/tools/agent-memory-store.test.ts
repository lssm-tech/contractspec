import { validateMemoryPath } from './agent-memory-store';
import { InMemoryAgentMemoryStore } from './in-memory-agent-memory-store';

describe('InMemoryAgentMemoryStore', () => {
  let store: InMemoryAgentMemoryStore;

  beforeEach(() => {
    store = new InMemoryAgentMemoryStore();
  });

  describe('validateMemoryPath', () => {
    it('accepts valid paths under /memories', () => {
      expect(() => validateMemoryPath('/memories')).not.toThrow();
      expect(() => validateMemoryPath('/memories/notes.txt')).not.toThrow();
      expect(() => validateMemoryPath('/memories/subdir/file.txt')).not.toThrow();
    });

    it('rejects paths outside /memories', () => {
      expect(() => validateMemoryPath('/etc/passwd')).toThrow(/Invalid memory path/);
      expect(() => validateMemoryPath('/other')).toThrow(/Invalid memory path/);
    });

    it('rejects traversal sequences', () => {
      expect(() => validateMemoryPath('/memories/../etc')).toThrow(/Invalid memory path/);
      expect(() => validateMemoryPath('/memories/..')).toThrow(/Invalid memory path/);
    });
  });

  describe('view', () => {
    it('returns directory listing for /memories when empty', async () => {
      const result = await store.view('/memories');
      expect(result).toContain('Here\'re the files and directories');
      expect(result).toContain('/memories');
    });

    it('returns file not exist for non-existent path', async () => {
      const result = await store.view('/memories/nonexistent.txt');
      expect(result).toContain('does not exist');
    });
  });

  describe('create', () => {
    it('creates a file and returns success', async () => {
      const result = await store.create('/memories/notes.txt', 'Hello World');
      expect(result).toContain('File created successfully');
      const view = await store.view('/memories/notes.txt');
      expect(view).toContain('Hello World');
    });

    it('returns error when file already exists', async () => {
      await store.create('/memories/notes.txt', 'First');
      const result = await store.create('/memories/notes.txt', 'Second');
      expect(result).toContain('already exists');
    });
  });

  describe('strReplace', () => {
    it('replaces text in file', async () => {
      await store.create('/memories/prefs.txt', 'Favorite color: blue');
      const result = await store.strReplace(
        '/memories/prefs.txt',
        'Favorite color: blue',
        'Favorite color: green'
      );
      expect(result).toContain('edited');
      const view = await store.view('/memories/prefs.txt');
      expect(view).toContain('Favorite color: green');
    });

    it('returns error when file does not exist', async () => {
      const result = await store.strReplace(
        '/memories/missing.txt',
        'old',
        'new'
      );
      expect(result).toContain('does not exist');
    });
  });

  describe('insert', () => {
    it('inserts text at line', async () => {
      await store.create('/memories/todo.txt', 'Line 1\nLine 3');
      await store.insert('/memories/todo.txt', 1, 'Line 2');
      const view = await store.view('/memories/todo.txt');
      expect(view).toContain('Line 2');
    });
  });

  describe('delete', () => {
    it('deletes file', async () => {
      await store.create('/memories/old.txt', 'content');
      const result = await store.delete('/memories/old.txt');
      expect(result).toContain('Successfully deleted');
      const view = await store.view('/memories/old.txt');
      expect(view).toContain('does not exist');
    });
  });

  describe('rename', () => {
    it('renames file', async () => {
      await store.create('/memories/draft.txt', 'content');
      const result = await store.rename(
        '/memories/draft.txt',
        '/memories/final.txt'
      );
      expect(result).toContain('Successfully renamed');
      const view = await store.view('/memories/final.txt');
      expect(view).toContain('content');
    });
  });
});
