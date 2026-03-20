import { BookOpen } from 'lucide-react';

import { type Recipe } from './types';

export interface RecipeDetailProps {
	recipe?: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
	if (!recipe) {
		return (
			<div className="flex flex-1 items-center justify-center rounded-2xl border border-border border-dashed">
				<p className="text-muted-foreground text-sm">
					Select a recipe to view details.
				</p>
			</div>
		);
	}

	return (
		<article className="space-y-4 rounded-2xl border border-border bg-card p-6">
			<header className="flex flex-wrap items-center gap-3">
				<BookOpen className="h-5 w-5 text-muted-foreground" />
				<div>
					<h2 className="font-semibold text-xl">{recipe.name}</h2>
					<p className="text-muted-foreground text-sm">{recipe.description}</p>
				</div>
			</header>

			<section>
				<h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
					Ingredients
				</h3>
				<ul className="mt-2 list-disc space-y-1 pl-6 text-foreground text-sm">
					{recipe.ingredients.map((ingredient) => (
						<li key={ingredient.id}>
							{ingredient.name} – {ingredient.quantity}
						</li>
					))}
				</ul>
			</section>

			<section>
				<h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
					Instructions
				</h3>
				<ol className="mt-2 list-decimal space-y-2 pl-6 text-foreground text-sm">
					{recipe.instructions.map((instruction) => (
						<li key={instruction.id}>{instruction.content}</li>
					))}
				</ol>
			</section>
		</article>
	);
}
