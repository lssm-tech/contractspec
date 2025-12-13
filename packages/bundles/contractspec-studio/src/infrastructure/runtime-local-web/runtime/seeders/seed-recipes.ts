import type { LocalDatabase } from '../../database/sqlite-wasm';

export async function seedRecipes(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM template_recipe WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const categoryId = 'recipe_category_ceremony';
  await db.run(
    `INSERT INTO template_recipe_category (id, nameEn, nameFr, icon) VALUES (?, ?, ?, ?)`,
    [categoryId, 'Ceremony', 'Cérémonie', '🎉']
  );

  const recipeId = 'recipe_1';
  await db.run(
    `INSERT INTO template_recipe (id, projectId, categoryId, slugEn, slugFr, nameEn, nameFr, descriptionEn, descriptionFr, heroImageUrl, prepTimeMinutes, cookTimeMinutes, servings, isFavorite)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      recipeId,
      projectId,
      categoryId,
      'studio-ritual',
      'rituel-studio',
      'Studio Ritual',
      'Rituel Studio',
      'Guide your teams through intent, review, deploy.',
      'Guidez vos équipes à travers intention, revue, déploiement.',
      null,
      15,
      30,
      6,
      1,
    ]
  );

  const ingredients = [
    {
      id: 'recipe_ing_1',
      nameEn: 'Signals stack',
      nameFr: 'Pile de signaux',
      quantity: '1 tray',
      ordering: 1,
    },
    {
      id: 'recipe_ing_2',
      nameEn: 'Policy gates',
      nameFr: 'Gates de politique',
      quantity: '3 steps',
      ordering: 2,
    },
    {
      id: 'recipe_ing_3',
      nameEn: 'Celebration tokens',
      nameFr: 'Jetons de célébration',
      quantity: 'Handful',
      ordering: 3,
    },
  ] as const;

  for (const ing of ingredients) {
    await db.run(
      `INSERT INTO template_recipe_ingredient (id, recipeId, nameEn, nameFr, quantity, ordering)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ing.id, recipeId, ing.nameEn, ing.nameFr, ing.quantity, ing.ordering]
    );
  }

  const instructions = [
    {
      id: 'recipe_step_1',
      contentEn: 'Assemble your intent signals and highlight hottest leads.',
      contentFr:
        'Assemblez vos signaux d’intention et mettez en avant les plus chauds.',
      ordering: 1,
    },
    {
      id: 'recipe_step_2',
      contentEn: 'Walk the team through policies and approvals.',
      contentFr:
        'Faites passer l’équipe à travers les politiques et validations.',
      ordering: 2,
    },
    {
      id: 'recipe_step_3',
      contentEn: 'Deploy and celebrate the milestone.',
      contentFr: 'Déployez et célébrez l’étape atteinte.',
      ordering: 3,
    },
  ] as const;

  for (const step of instructions) {
    await db.run(
      `INSERT INTO template_recipe_instruction (id, recipeId, contentEn, contentFr, ordering)
       VALUES (?, ?, ?, ?, ?)`,
      [step.id, recipeId, step.contentEn, step.contentFr, step.ordering]
    );
  }
}


