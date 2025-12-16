import type { LocalDatabase } from '../../database/sqlite-wasm';

export async function seedTodos(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM template_task WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const workCategoryId = 'todo_category_ops';
  const homeCategoryId = 'todo_category_home';

  await db.run(
    `INSERT INTO template_task_category (id, projectId, name, color) VALUES (?, ?, ?, ?)`,
    [workCategoryId, projectId, 'Operations', '#8b5cf6']
  );
  await db.run(
    `INSERT INTO template_task_category (id, projectId, name, color) VALUES (?, ?, ?, ?)`,
    [homeCategoryId, projectId, 'Home', '#f472b6']
  );

  const tasks = [
    {
      id: 'todo_task_1',
      title: 'Review intent signals',
      description: 'Scan yesterday’s signals and flag the ones to promote.',
      categoryId: workCategoryId,
      priority: 'HIGH',
    },
    {
      id: 'todo_task_2',
      title: 'Schedule studio walkthrough',
      description: 'Prep the sandbox before tomorrow’s ceremony.',
      categoryId: workCategoryId,
      priority: 'MEDIUM',
    },
    {
      id: 'todo_task_3',
      title: 'Collect testimonials',
      description: 'Ask last week’s pilot crew for quotes.',
      categoryId: homeCategoryId,
      priority: 'LOW',
    },
  ] as const;

  for (const task of tasks) {
    await db.run(
      `INSERT INTO template_task (id, projectId, categoryId, title, description, completed, priority, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        projectId,
        task.categoryId,
        task.title,
        task.description,
        0,
        task.priority,
        JSON.stringify(['demo']),
      ]
    );
  }
}






