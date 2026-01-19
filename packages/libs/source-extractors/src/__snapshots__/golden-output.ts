/**
 * Golden output snapshot for NestJS fixture.
 *
 * Expected IR output from extracting the NestJS fixture.
 */

import type { ImportIR } from '../types';

export const nestjsGoldenSnapshot: Partial<ImportIR> = {
  version: '1.0',
  endpoints: [
    {
      id: expect.stringContaining('get.users'),
      method: 'GET',
      path: '/users',
      kind: 'query',
      handlerName: 'getUsers',
      controllerName: 'UsersController',
      confidence: {
        level: 'medium',
        reasons: ['decorator-hints'],
      },
    },
    {
      id: expect.stringContaining('get.users'),
      method: 'GET',
      path: '/users/:id',
      kind: 'query',
      handlerName: 'getUser',
      controllerName: 'UsersController',
      confidence: {
        level: 'medium',
        reasons: ['decorator-hints'],
      },
    },
    {
      id: expect.stringContaining('post.users'),
      method: 'POST',
      path: '/users',
      kind: 'command',
      handlerName: 'createUser',
      controllerName: 'UsersController',
      confidence: {
        level: 'medium',
        reasons: ['decorator-hints'],
      },
    },
  ],
  schemas: [
    {
      id: expect.stringContaining('CreateUserDto'),
      name: 'CreateUserDto',
      schemaType: 'class-validator',
      confidence: {
        level: 'high',
        reasons: ['explicit-schema'],
      },
    },
  ],
};

/**
 * Golden output snapshot for Express fixture.
 */
export const expressGoldenSnapshot: Partial<ImportIR> = {
  version: '1.0',
  endpoints: [
    {
      id: expect.stringContaining('get.products'),
      method: 'GET',
      path: '/products',
      kind: 'query',
    },
    {
      id: expect.stringContaining('get.products'),
      method: 'GET',
      path: '/products/:id',
      kind: 'query',
    },
    {
      id: expect.stringContaining('post.products'),
      method: 'POST',
      path: '/products',
      kind: 'command',
    },
    {
      id: expect.stringContaining('put.products'),
      method: 'PUT',
      path: '/products/:id',
      kind: 'command',
    },
    {
      id: expect.stringContaining('delete.products'),
      method: 'DELETE',
      path: '/products/:id',
      kind: 'command',
    },
  ],
};

/**
 * Golden output snapshot for tRPC fixture.
 */
export const trpcGoldenSnapshot: Partial<ImportIR> = {
  version: '1.0',
  endpoints: [
    {
      id: 'trpc.list',
      method: 'GET',
      path: '/trpc/list',
      kind: 'query',
      handlerName: 'list',
    },
    {
      id: 'trpc.getById',
      method: 'GET',
      path: '/trpc/getById',
      kind: 'query',
      handlerName: 'getById',
    },
    {
      id: 'trpc.create',
      method: 'POST',
      path: '/trpc/create',
      kind: 'command',
      handlerName: 'create',
    },
    {
      id: 'trpc.update',
      method: 'POST',
      path: '/trpc/update',
      kind: 'command',
      handlerName: 'update',
    },
    {
      id: 'trpc.delete',
      method: 'POST',
      path: '/trpc/delete',
      kind: 'command',
      handlerName: 'delete',
    },
  ],
};
