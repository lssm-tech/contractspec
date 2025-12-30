/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gql } from '@apollo/client';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';

import { LocalRuntimeServices } from '../../infrastructure/runtime-local-web';
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

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Conversation {
  id: string;
  name: string;
  isGroup: boolean;
}

interface Message {
  id: string;
  content: string;
}

interface Recipe {
  id: string;
  name: string;
  locale: string;
}

describe('Template runtime GraphQL flows', () => {
  let runtime: LocalRuntimeServices;
  let installer: TemplateInstaller;

  beforeEach(async () => {
    runtime = new LocalRuntimeServices();
    // PGLite is lazy-loaded and doesn't need a modulesPath
    await runtime.init();
    installer = new TemplateInstaller({ runtime });
  });

  afterEach(async () => {
    // Clean up PGLite instance
    if (runtime.isInitialized()) {
      await runtime.db.close();
    }
  });

  it('runs CRUD flow for the todos template', async () => {
    await installer.install('todos-app', { projectId: 'todos-test' });
    const client = runtime.graphql.apollo;

    const initial = await client.query<{ tasks: Task[] }>({
      query: TASKS_QUERY,
      variables: { projectId: 'todos-test' },
      fetchPolicy: 'network-only',
    });
    expect(initial.data!.tasks.length).toBeGreaterThan(0);

    const createResult = await client.mutate<{ createTask: Task }>({
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
    expect(createResult.data!.createTask.title).toBe('Write Vitest');

    const tasksAfterCreate = await client.query<{ tasks: Task[] }>({
      query: TASKS_QUERY,
      variables: { projectId: 'todos-test' },
      fetchPolicy: 'network-only',
    });
    const createdTask = tasksAfterCreate.data!.tasks.find(
      (task) => task.title === 'Write Vitest'
    );
    expect(createdTask).toBeDefined();

    await client.mutate({
      mutation: TOGGLE_TASK_MUTATION,
      variables: { id: createdTask!.id, completed: true },
    });
    const toggled = await client.query<{ tasks: Task[] }>({
      query: TASKS_QUERY,
      variables: { projectId: 'todos-test' },
      fetchPolicy: 'network-only',
    });
    const toggledTask = toggled.data!.tasks.find(
      (task) => task.id === createdTask!.id
    );
    expect(toggledTask!.completed).toBe(true);
  });

  it('delivers messages for the messaging template', async () => {
    await installer.install('messaging-app', { projectId: 'messaging-test' });
    const client = runtime.graphql.apollo;

    const conversations = await client.query<{
      conversations: Conversation[];
    }>({
      query: CONVERSATIONS_QUERY,
      variables: { projectId: 'messaging-test' },
      fetchPolicy: 'network-only',
    });
    expect(conversations.data!.conversations.length).toBeGreaterThan(0);

    const firstConversation = conversations.data!.conversations[0]!;
    const sendResult = await client.mutate<{ sendMessage: Message }>({
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
    expect(sendResult.data!.sendMessage.content).toContain('Vitest');
  });

  it('supports locale switching for the recipe template', async () => {
    await installer.install('recipe-app-i18n', { projectId: 'recipes-test' });
    const client = runtime.graphql.apollo;

    const enRecipes = await client.query<{ recipes: Recipe[] }>({
      query: RECIPES_QUERY,
      variables: { projectId: 'recipes-test', locale: 'EN' },
      fetchPolicy: 'network-only',
    });
    const frRecipes = await client.query<{ recipes: Recipe[] }>({
      query: RECIPES_QUERY,
      variables: { projectId: 'recipes-test', locale: 'FR' },
      fetchPolicy: 'network-only',
    });

    expect(enRecipes.data!.recipes.length).toBeGreaterThan(0);
    expect(frRecipes.data!.recipes.length).toBeGreaterThan(0);
    expect(enRecipes.data!.recipes[0]!.name).not.toEqual(
      frRecipes.data!.recipes[0]!.name
    );
  });
});
