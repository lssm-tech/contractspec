import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

import {
  registerTemplateComponents,
  useTemplateRuntime,
} from '../../../../templates/runtime';
import { LanguageSwitcher } from './LanguageSwitcher';
import { RecipeCard } from './RecipeCard';
import { RecipeDetail } from './RecipeDetail';
import { type Recipe } from './types';

const RECIPES_QUERY = gql`
  query Recipes($projectId: ID!, $locale: RecipeLocale!) {
    recipes(projectId: $projectId, locale: $locale) {
      id
      name
      description
      heroImageUrl
      prepTimeMinutes
      cookTimeMinutes
      servings
      isFavorite
      locale
      category {
        id
        nameEn
        nameFr
      }
      ingredients {
        id
        name
        quantity
      }
      instructions {
        id
        content
        ordering
      }
    }
  }
`;

const FAVORITE_RECIPE = gql`
  mutation FavoriteRecipe($id: ID!, $isFavorite: Boolean!) {
    favoriteRecipe(id: $id, isFavorite: $isFavorite) {
      id
      isFavorite
    }
  }
`;

export function RecipeList() {
  const { projectId } = useTemplateRuntime();
  const [locale, setLocale] = useState<'EN' | 'FR'>('EN');
  const [selected, setSelected] = useState<Recipe | undefined>();
  const [search, setSearch] = useState('');
  const { data, loading } = useQuery<any>(RECIPES_QUERY, {
    variables: { projectId, locale },
    fetchPolicy: 'cache-and-network',
  });
  const [favoriteRecipe] = useMutation(FAVORITE_RECIPE);

  const recipes: Recipe[] = data?.recipes ?? [];
  const filtered = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFavorite = async (recipe: Recipe) => {
    await favoriteRecipe({
      variables: { id: recipe.id, isFavorite: !recipe.isFavorite },
      optimisticResponse: {
        favoriteRecipe: {
          __typename: 'Recipe',
          id: recipe.id,
          isFavorite: !recipe.isFavorite,
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <LanguageSwitcher locale={locale} onChange={setLocale} />
        <input
          type="search"
          placeholder={
            locale === 'EN' ? 'Search recipes' : 'Rechercher des recettes'
          }
          className="border-border bg-card flex-1 rounded-full border px-4 py-2 text-sm"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading recipes…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={setSelected}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      <RecipeDetail recipe={selected} />
    </div>
  );
}

registerTemplateComponents('recipe-app-i18n', {
  list: RecipeList,
  detail: RecipeDetail,
});
