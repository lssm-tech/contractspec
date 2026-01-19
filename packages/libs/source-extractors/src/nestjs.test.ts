/**
 * Unit tests for NestJS extractor.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { NestJsExtractor } from './extractors/nestjs/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';

const FIXTURE_CONTENT = `
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}

@Controller('users')
export class UsersController {
  @Get()
  async getUsers(@Query() query: GetUsersQueryDto): Promise<UserResponse[]> {
    return [];
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    return { id, name: '', email: '', createdAt: new Date() };
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponse> {
    return { id: 'new-id', ...dto, createdAt: new Date() };
  }
}
`;

describe('NestJsExtractor', () => {
  let extractor: NestJsExtractor;
  let mockFs: ExtractorFsAdapter;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new NestJsExtractor();

    mockFs = {
      readFile: async (path: string) => {
        if (path.includes('users.controller.ts')) {
          return FIXTURE_CONTENT;
        }
        return '';
      },
      glob: async () => ['src/users.controller.ts'],
      exists: async () => true,
    };

    extractor.setFs(mockFs);

    project = {
      rootPath: '/test-project',
      frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
    };
  });

  it('should detect NestJS projects', async () => {
    const detected = await extractor.detect(project);
    expect(detected).toBe(true);
  });

  it('should not detect non-NestJS projects', async () => {
    const nonNestProject: ProjectInfo = {
      rootPath: '/other-project',
      frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
    };
    const detected = await extractor.detect(nonNestProject);
    expect(detected).toBe(false);
  });

  it('should extract endpoints from controller', async () => {
    const result = await extractor.extract(project, {});

    expect(result.success).toBe(true);
    expect(result.ir).toBeDefined();
    expect(result.ir).toBeDefined();
    expect(result.ir?.endpoints.length).toBeGreaterThan(0);
  });

  it('should extract GET endpoints', async () => {
    const result = await extractor.extract(project, {});

    const getEndpoints =
      result.ir?.endpoints.filter((e) => e.method === 'GET') || [];
    expect(getEndpoints.length).toBeGreaterThanOrEqual(1);
  });

  it('should extract POST endpoints', async () => {
    const result = await extractor.extract(project, {});

    const postEndpoints =
      result.ir?.endpoints.filter((e) => e.method === 'POST') || [];
    expect(postEndpoints.length).toBeGreaterThanOrEqual(1);
  });

  it('should extract DTOs as schemas', async () => {
    const result = await extractor.extract(project, {});

    expect(result.ir?.schemas.length).toBeGreaterThan(0);
    const dto = result.ir?.schemas.find((s) => s.name === 'CreateUserDto');
    expect(dto).toBeDefined();
  });

  it('should identify class-validator schema type', async () => {
    const result = await extractor.extract(project, {});

    const dto = result.ir?.schemas.find((s) => s.name === 'CreateUserDto');
    expect(dto?.schemaType).toBe('class-validator');
  });

  it('should assign high confidence to class-validator DTOs', async () => {
    const result = await extractor.extract(project, {});

    const dto = result.ir?.schemas.find((s) => s.name === 'CreateUserDto');
    expect(dto?.confidence.level).toBe('high');
  });

  it('should include source location', async () => {
    const result = await extractor.extract(project, {});

    const endpoints = result.ir?.endpoints || [];
    for (const endpoint of endpoints) {
      expect(endpoint.source.file).toBeDefined();
      expect(endpoint.source.startLine).toBeGreaterThan(0);
    }
  });
});
