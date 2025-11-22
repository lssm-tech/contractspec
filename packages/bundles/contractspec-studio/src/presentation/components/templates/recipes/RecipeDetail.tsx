import { BookOpen } from 'lucide-react';

import { type Recipe } from './types';

export interface RecipeDetailProps {
  recipe?: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  if (!recipe) {
    return (
      <div className="border-border flex flex-1 items-center justify-center rounded-2xl border border-dashed">
        <p className="text-muted-foreground text-sm">
          Select a recipe to view details.
        </p>
      </div>
    );
  }

  return (
    <article className="border-border bg-card space-y-4 rounded-2xl border p-6">
      <header className="flex flex-wrap items-center gap-3">
        <BookOpen className="text-muted-foreground h-5 w-5" />
        <div>
          <h2 className="text-xl font-semibold">{recipe.name}</h2>
          <p className="text-muted-foreground text-sm">{recipe.description}</p>
        </div>
      </header>

      <section>
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          Ingredients
        </h3>
        <ul className="text-foreground mt-2 list-disc space-y-1 pl-6 text-sm">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.name} – {ingredient.quantity}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          Instructions
        </h3>
        <ol className="text-foreground mt-2 list-decimal space-y-2 pl-6 text-sm">
          {recipe.instructions.map((instruction) => (
            <li key={instruction.id}>{instruction.content}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}

