import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { createNodeFsAdapter } from './fs';

// Node fs mocks
const mockAccess = mock(() => Promise.resolve());
const mockReadFile = mock(() => Promise.resolve('content'));
const mockWriteFile = mock(() => Promise.resolve());
const mockMkdir = mock(() => Promise.resolve());
const mockRm = mock(() => Promise.resolve());
const mockStat = mock(() =>
  Promise.resolve({
    size: 100,
    isFile: () => true,
    isDirectory: () => false,
    mtime: new Date(),
  })
);

mock.module('node:fs/promises', () => ({
  access: mockAccess,
  readFile: mockReadFile,
  writeFile: mockWriteFile,
  mkdir: mockMkdir,
  rm: mockRm,
  stat: mockStat,
}));

mock.module('glob', () => ({
  glob: () => Promise.resolve(['/path/to/file']),
}));

describe('FS Adapter', () => {
  beforeEach(() => {
    mockAccess.mockClear();
    mockReadFile.mockClear();
    mockWriteFile.mockClear();
    mockMkdir.mockClear();
    mockRm.mockClear();
    mockStat.mockClear();
  });

  const fs = createNodeFsAdapter('/cwd');

  it('exists should return true if access succeeds', async () => {
    expect(await fs.exists('file.txt')).toBe(true);
  });

  it('exists should return false if access fails', async () => {
    mockAccess.mockRejectedValueOnce(new Error('no ent'));
    expect(await fs.exists('file.txt')).toBe(false);
  });

  it('readFile should read content', async () => {
    const content = await fs.readFile('file.txt');
    expect(content).toBe('content');
    expect(mockReadFile).toHaveBeenCalled();
  });

  it('writeFile should write content', async () => {
    await fs.writeFile('file.txt', 'data');
    expect(mockWriteFile).toHaveBeenCalled();
    expect(mockMkdir).toHaveBeenCalled(); // Should ensure dir exists
  });

  it('remove should delete file', async () => {
    await fs.remove('file.txt');
    expect(mockRm).toHaveBeenCalled();
  });

  it('stat should return stats', async () => {
    const stats = await fs.stat('file.txt');
    expect(stats.size).toBe(100);
    expect(stats.isFile).toBe(true);
  });

  it('mkdir should create directory', async () => {
    await fs.mkdir('dir');
    expect(mockMkdir).toHaveBeenCalled();
  });

  it('glob should find files', async () => {
    const files = await fs.glob({ pattern: '*.ts' });
    expect(files).toEqual(['/path/to/file']);
  });

  it('path utils should work', () => {
    expect(fs.resolve('file')).toBeDefined();
    expect(fs.dirname('/a/b')).toBe('/a');
    expect(fs.basename('/a/b')).toBe('b');
    expect(fs.join('a', 'b')).toBe('a/b');
    expect(fs.relative('/a', '/a/b')).toBe('b');
  });
});
