import { Recipe } from '../types';

// Always use serverless proxy (Netlify). No direct OpenAI calls from client.
const API_BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL;

export interface RecipeGenerationRequest {
  ingredients: string[];
  servings?: number;
  dietaryRestrictions?: string[];
  cuisine?: string;
}

function _sanitizeToJson(text: string): string {
  // Remove Markdown code fences if present
  const fenced = text.match(/```(?:json)?\n([\s\S]*?)```/i);
  if (fenced && fenced[1]) return fenced[1].trim();
  return text.trim();
}

export async function generateRecipe(request: RecipeGenerationRequest): Promise<Recipe> {
  const { ingredients, servings = 4, dietaryRestrictions = [], cuisine = 'any' } = request;

  // Build endpoint for Netlify functions. If no base is provided, use relative path.
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : '';
  const endpoint = `${base}/.netlify/functions/generate-recipe`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, servings, dietaryRestrictions, cuisine }),
    });

    if (res.ok) {
      const recipe = (await res.json()) as Recipe;
      return recipe;
    }
    throw new Error(`Proxy request failed: ${res.status}`);
  } catch (error) {
    console.error('Recipe proxy call failed:', error);
    return createFallbackRecipe(ingredients);
  }

const _prompt = `Create a practical, delicious recipe using these ingredients:

  Constraints:
  - Servings: ${servings}
  - Dietary restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'none'}
  - Cuisine preference: ${cuisine}

  Respond ONLY with a single JSON object in this exact schema (no markdown, no commentary):
  {
    "name": string,
    "description": string,
    "ingredients": string[],
    "steps": string[],
    "image": string
  }

  Make sure the recipe is feasible, concise, and uses the provided ingredients as primary components.`;

  // Unreachable now due to proxy-only approach; kept for type flow
}

// Fallback function that creates a dynamic recipe when the proxy/API fails
function createFallbackRecipe(ingredients: string[]): Recipe {
  const main = ingredients.map((s) => s.trim()).filter(Boolean);
  const base = main.join(' ') || 'dish';
  const sig = Array.from(base).reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0);

  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const fats = ['oil', 'olive oil', 'ghee', 'butter'];
  const methods = ['sauté', 'stir-fry', 'simmer', 'pan-roast', 'quick braise'];
  const times = [8, 10, 12, 14, 15, 18];
  const seasonings = [
    'salt and pepper to taste',
    'a pinch of chili flakes',
    'mixed herbs',
    'garam masala',
    'Italian seasoning',
  ];

  const has = (name: string) => main.some((m) => m.toLowerCase().includes(name));
  const aromatics: string[] = [];
  if (has('onion')) aromatics.push('onion');
  if (has('garlic')) aromatics.push('garlic');
  if (has('ginger')) aromatics.push('ginger');

  const method = pick(methods);
  const time = pick(times);
  const fat = pick(fats);
  const seasoning = pick(seasonings);

  const steps: string[] = [];
  steps.push('Rinse, peel, and chop your ingredients for even cooking.');
  steps.push(`Warm ${fat} in a wide pan over medium ${Math.random() < 0.5 ? 'to medium-high ' : ''}heat until shimmering.`);
  if (aromatics.length) steps.push(`Add ${aromatics.join(' and ')} and cook 1–2 minutes until fragrant.`);
  if (main.length) steps.push(`Add ${main.join(', ')} and ${method} for ${Math.max(2, Math.floor(time / 2))}–${time} minutes.`);
  steps.push(`Season with ${seasoning}, adjusting to taste.`);
  steps.push('If the pan gets dry, splash in water or stock, then serve warm.');

  return {
    id: Date.now().toString(),
    name: `Simple ${main[0] || 'Dish'}`,
    description: `A quick ${method} with ${main.join(' and ') || 'pantry staples'}.`,
    ingredients: [...main, seasoning, fat],
    steps,
    image: `https://source.unsplash.com/1200x600/?food,${encodeURIComponent(base)}&sig=${Math.abs(sig)}`,
  };
}
