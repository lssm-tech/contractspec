export interface Recipe {
  id: string;
  name: string;
  description?: string | null;
  heroImageUrl?: string | null;
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  servings?: number | null;
  isFavorite: boolean;
  locale: 'EN' | 'FR';
  category?: {
    id: string;
    nameEn: string;
    nameFr: string;
  } | null;
  ingredients: Array<{
    id: string;
    name: string;
    quantity: string;
  }>;
  instructions: Array<{
    id: string;
    content: string;
    ordering: number;
  }>;
}


