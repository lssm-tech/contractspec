import { describe, expect, it } from 'bun:test';
import { getConventionPaths, toKebabCase } from './conventions';

describe('conventions', () => {
  describe('toKebabCase', () => {
    it('should convert PascalCase to kebab-case', () => {
      expect(toKebabCase('MySpec')).toBe('my-spec');
      expect(toKebabCase('UserProfile')).toBe('user-profile');
    });

    it('should handle dot notation', () => {
      expect(toKebabCase('user.profile')).toBe('user-profile');
      expect(toKebabCase('User.Profile')).toBe('user-profile');
    });
  });

  describe('getConventionPaths', () => {
    const outputDir = 'src';

    it('should return handler and test for operation', () => {
      const result = getConventionPaths('operation', 'CreateUser', outputDir);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        path: 'src/handlers/create-user.handler.ts',
        type: 'handler',
      });
      expect(result).toContainEqual({
        path: 'src/handlers/create-user.handler.test.ts',
        type: 'test',
      });
    });

    it('should return component and test for presentation', () => {
      const result = getConventionPaths('presentation', 'UserCard', outputDir);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        path: 'src/components/user-card.tsx',
        type: 'component',
      });
      expect(result).toContainEqual({
        path: 'src/components/user-card.test.tsx',
        type: 'test',
      });
    });

    it('should return form and test for form', () => {
      const result = getConventionPaths('form', 'EditProfile', outputDir);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        path: 'src/forms/edit-profile.form.tsx',
        type: 'form',
      });
      expect(result).toContainEqual({
        path: 'src/forms/edit-profile.form.test.tsx',
        type: 'test',
      });
    });
  });
});
