import React, { useState, useEffect, useMemo } from 'react';
import { Utensils, Sparkles, ChefHat, Loader2 } from 'lucide-react';
import { InventoryItem, Recipe } from '../types';
import { generateRecipe } from '../services/recipeApi';

interface RecipesProps {
  availableIngredients: InventoryItem[];
}

const Recipes: React.FC<RecipesProps> = ({ availableIngredients }) => {
  const [ingredientsText, setIngredientsText] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Initialize prompt with current inventory names
    const inventoryIngredients = availableIngredients.map((item) => item.name);
    setIngredientsText(inventoryIngredients.join(', '));
    setRecipes([]);
  }, [availableIngredients]);

  const parsedIngredients = useMemo(() => {
    return ingredientsText
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [ingredientsText]);

  const generateRecipeFromAPI = async () => {
    if (parsedIngredients.length === 0) {
      setError('Please enter at least one ingredient to generate a recipe');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const newRecipe = await generateRecipe({
        ingredients: parsedIngredients,
        servings: 4,
        cuisine: 'any',
      });

      setRecipes((prev) => [newRecipe, ...prev]);
    } catch (err) {
      console.error('Recipe generation failed:', err);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="recipes" className="py-16 bg-green-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Utensils className="w-8 h-8 text-green-500" />
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 font-heading">AI Recipe Generator</h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Let AI create personalized recipes from your kitchen ingredients
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-full">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Powered by OpenAI GPT</span>
          </div>
        </div>

        {/* Ingredient Prompt */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Enter ingredients you have:</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="e.g., rice, milk, tomato, onion"
                className="w-full px-4 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tip: separate items with commas. Example: "rice, milk, tomato".
              </p>
            </div>
          </div>

          <div className="text-center">
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl border border-red-200 dark:border-red-800/50">
                {error}
              </div>
            )}
            <button
              onClick={generateRecipeFromAPI}
              disabled={isGenerating || parsedIngredients.length === 0}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  Creating Your Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="w-7 h-7" />
                  Generate AI Recipe
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              🤖 AI will analyze your ingredients and create a custom recipe just for you!
            </p>
            {parsedIngredients.length > 0 && (
              <p className="text-sm text-green-600 dark:text-green-300 mt-2 font-medium">
                ✨ Ready to create recipe with: {parsedIngredients.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={recipe.image || `https://source.unsplash.com/1200x600/?food,${encodeURIComponent(`${recipe.name} ${recipe.ingredients.join(' ')}`)}&sig=${Math.abs(Array.from(`${recipe.name} ${recipe.ingredients.join(' ')}`).reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0))}`}
                  alt={recipe.name}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const base = `${recipe.name} ${recipe.ingredients.join(' ')}`;
                    const sig = Math.abs(Array.from(base).reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0));
                    target.src = `https://source.unsplash.com/1200x600/?food,${encodeURIComponent(base)}&sig=${sig}`;
                  }}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-heading">
                    {recipe.name}
                  </h4>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">{recipe.description}</p>
                
                <div className="mb-4">
                  <h5 className="text-lg font-semibold text-green-600 dark:text-green-300 mb-2">Ingredients:</h5>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold text-orange-600 dark:text-orange-300 mb-2">Steps:</h5>
                  <ol className="space-y-3">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="relative pl-10">
                        <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-700 dark:text-gray-200">
                          {step}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recipes;
