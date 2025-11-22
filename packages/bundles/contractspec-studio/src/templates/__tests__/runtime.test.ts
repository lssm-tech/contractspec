import { describe, it, expect, beforeEach } from 'vitest';
import { gql } from '@apollo/client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { LocalRuntimeServices } from '@lssm/lib.runtime-local';
import { TemplateInstaller } from '../installer';

const TASKS_QUERY = gql`
  query Tasks($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      title
      completed
    }
  }
`;

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
    }
  }
`;

const TOGGLE_TASK_MUTATION = gql`
  mutation ToggleTask($id: ID!, $completed: Boolean!) {
    toggleTask(id: $id, completed: $completed) {
      id
      completed
    }
  }
`;

const CONVERSATIONS_QUERY = gql`
  query Conversations($projectId: ID!) {
    conversations(projectId: $projectId) {
      id
      name
      isGroup
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
    }
  }
`;

const RECIPES_QUERY = gql`
  query Recipes($projectId: ID!, $locale: RecipeLocale!) {
    recipes(projectId: $projectId, locale: $locale) {
      id
      name
      locale
    }
  }
`;

describe('Template runtime GraphQL flows', () => {
  let runtime: LocalRuntimeServices;
  let installer: TemplateInstaller;
  const sqlModulesPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../../../../node_modules/sql.js/dist'
  );

  beforeEach(async () => {
    runtime = new LocalRuntimeServices();
    await runtime.init({ modulesPath: sqlModulesPath });
    installer = new TemplateInstaller({ runtime });
  });

  it('runs CRUD flow for the todos template', async () => {
    await installer.install('todos-app', { projectId: 'todos-test' });
    const client = runtime.graphql.apollo;

    const initial = await client.query({
      query: TASKS_QUERY,
      variables: { projectId: 'todos-test' },
      fetchPolicy: 'network-only',
    });
    expect(initial.data.tasks.length).toBeGreaterThan(0);

    const createResult = await client.mutate({
      mutation: CREATE_TASK_MUTATION,
      variables: {
        input: {
          projectId: 'todos-test',
          title: 'Write Vitest',
          priority: 'HIGH',
        },
      },
      refetchQueries: [],
    });
    expect(createResult.data?.createTask.title).toBe('Write Vitest');

    const tasksAfterCreate = await client.query({
      query: TASKS_QUERY,
      variables: { projectId: 'todos-test' },
      fetchPolicy: 'network-only',
    });
    const createdTask = tasksAfterCreate.data.tasks.find(
      (task: { title: string }) => task.title === 'Write Vitest'
    );
    expect(createdTask).toBeDefined();

    await client.mutate({
      mutation: TOGGLE_TASK_MUTATION,
      variables: { id: createdTask.id, completed: true },
    });
    const toggled = await client.query({
      query: TASKS_QUERY,
      variables: { projectId: 'todos-test' },
      fetchPolicy: 'network-only',
    });
    const toggledTask = toggled.data.tasks.find(
      (task: { id: string }) => task.id === createdTask.id
    );
    expect(toggledTask.completed).toBe(true);
  });

  it('delivers messages for the messaging template', async () => {
    await installer.install('messaging-app', { projectId: 'messaging-test' });
    const client = runtime.graphql.apollo;

    const conversations = await client.query({
      query: CONVERSATIONS_QUERY,
      variables: { projectId: 'messaging-test' },
      fetchPolicy: 'network-only',
    });
    expect(conversations.data.conversations.length).toBeGreaterThan(0);

    const firstConversation = conversations.data.conversations[0];
    const sendResult = await client.mutate({
      mutation: SEND_MESSAGE_MUTATION,
      variables: {
        input: {
          projectId: 'messaging-test',
          conversationId: firstConversation.id,
          senderId: 'tester',
          senderName: 'Tester',
          content: 'Hello from Vitest',
        },
      },
    });
    expect(sendResult.data?.sendMessage.content).toContain('Vitest');
  });

  it('supports locale switching for the recipe template', async () => {
    await installer.install('recipe-app-i18n', { projectId: 'recipes-test' });
    const client = runtime.graphql.apollo;

    const enRecipes = await client.query({
      query: RECIPES_QUERY,
      variables: { projectId: 'recipes-test', locale: 'EN' },
      fetchPolicy: 'network-only',
    });
    const frRecipes = await client.query({
      query: RECIPES_QUERY,
      variables: { projectId: 'recipes-test', locale: 'FR' },
      fetchPolicy: 'network-only',
    });

    expect(enRecipes.data.recipes.length).toBeGreaterThan(0);
    expect(frRecipes.data.recipes.length).toBeGreaterThan(0);
    expect(enRecipes.data.recipes[0].name).not.toEqual(
      frRecipes.data.recipes[0].name
    );
  });
});
