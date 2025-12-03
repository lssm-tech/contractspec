import { Heart } from 'lucide-react';

import { type Recipe } from './types';

export interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (recipe: Recipe) => void;
  onToggleFavorite?: (recipe: Recipe) => void;
}

export function RecipeCard({
  recipe,
  onSelect,
  onToggleFavorite,
}: RecipeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(recipe)}
      className="border-border bg-card flex flex-col gap-3 rounded-2xl border text-left transition hover:border-violet-400"
    >
      {recipe.heroImageUrl ? (
        <img
          src={recipe.heroImageUrl}
          alt={recipe.name}
          className="h-40 w-full rounded-t-2xl object-cover"
        />
      ) : (
        <div className="bg-muted h-40 rounded-t-2xl" />
      )}
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">{recipe.name}</p>
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-full border border-transparent p-2 ${
              recipe.isFavorite
                ? 'text-red-400'
                : 'text-muted-foreground hover:text-red-400'
            }`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite?.(recipe);
            }}
          >
            <Heart
              className={`h-4 w-4 ${recipe.isFavorite ? 'fill-red-400' : ''}`}
            />
          </button>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {recipe.description}
        </p>
        <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
          {recipe.prepTimeMinutes ? (
            <span>Prep {recipe.prepTimeMinutes}m</span>
          ) : null}
          {recipe.cookTimeMinutes ? (
            <span>Cook {recipe.cookTimeMinutes}m</span>
          ) : null}
          {recipe.servings ? <span>{recipe.servings} servings</span> : null}
        </div>
      </div>
    </button>
  );
}

