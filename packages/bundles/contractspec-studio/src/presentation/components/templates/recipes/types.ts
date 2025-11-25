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
  ingredients: {
    id: string;
    name: string;
    quantity: string;
  }[];
  instructions: {
    id: string;
    content: string;
    ordering: number;
  }[];
}







