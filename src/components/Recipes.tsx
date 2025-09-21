import React, { useState, useEffect } from 'react';
import { Utensils, Sparkles, ChefHat } from 'lucide-react';
import { InventoryItem, Recipe } from '../types';

interface RecipesProps {
  availableIngredients: InventoryItem[];
}

const Recipes: React.FC<RecipesProps> = ({ availableIngredients }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const commonIngredients = [
    'Rice', 'Milk', 'Bread', 'Sugar', 'Onion', 'Tomato',
    'Capsicum', 'Carrot', 'Spring Onion', 'Egg', 'Cabbage', 'Coriander'
  ];

  useEffect(() => {
    // Initialize with ingredients from inventory
    const inventoryIngredients = availableIngredients.map(item => item.name);
    setSelectedIngredients(inventoryIngredients);
    
    // Set initial recipes
    const initialRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Vegetable Fried Rice',
        ingredients: ['Rice', 'Vegetables', 'Onion', 'Soy Sauce'],
        steps: [
          'Heat oil in a pan and sauté vegetables',
          'Add cooked rice and mix well',
          'Season with soy sauce and spices',
          'Garnish and serve hot'
        ],
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'A delicious and quick fried rice with mixed vegetables'
      },
      {
        id: '2',
        name: 'Bread Pudding',
        ingredients: ['Bread', 'Milk', 'Sugar', 'Vanilla'],
        steps: [
          'Soak bread pieces in warm milk',
          'Add sugar and vanilla essence',
          'Bake in oven until golden brown',
          'Serve warm or chilled'
        ],
        image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Sweet and comforting dessert made from leftover bread'
      }
    ];
    setRecipes(initialRecipes);
  }, [availableIngredients]);

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const generateRecipe = () => {
    if (selectedIngredients.length === 0) {
      alert('Please select at least one ingredient to generate a recipe');
      return;
    }

    // Generate a simple recipe based on selected ingredients
    const recipeName = selectedIngredients.some(ing => ing.toLowerCase().includes('rice')) ? 
      `${selectedIngredients.join(' & ')} Fried Rice` : 
      selectedIngredients.some(ing => ing.toLowerCase().includes('bread')) ?
      `${selectedIngredients.join(' & ')} Toast` :
      `${selectedIngredients[0]} Special Dish`;

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: recipeName,
      ingredients: selectedIngredients.slice(0, 5),
      steps: [
        'Prepare all ingredients by washing and chopping',
        'Heat oil in a pan and add aromatics like onion and garlic',
        `Cook ${selectedIngredients.join(', ')} together with spices to taste`,
        'Season well with salt, pepper, and your favorite herbs',
        'Cook until everything is well combined and serve hot'
      ],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: `A custom recipe using your selected ingredients: ${selectedIngredients.join(', ')}`
    };

    setRecipes(prev => [newRecipe, ...prev]);
    
    // Show success message
    alert(`Recipe "${recipeName}" generated successfully! Check it out below.`);
  };

  return (
    <section id="recipes" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Utensils className="w-8 h-8 text-green-500" />
            <h2 className="text-4xl font-bold text-gray-800 font-heading">Smart Recipe Generator</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create amazing dishes from your available ingredients
          </p>
        </div>

        {/* Ingredient Selector */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-12 border border-gray-200">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Ingredients:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {commonIngredients.map((ingredient) => {
                const isSelected = selectedIngredients.includes(ingredient);
                const isFromInventory = availableIngredients.some(item => 
                  item.name.toLowerCase() === ingredient.toLowerCase()
                );

                return (
                  <button
                    key={ingredient}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                      isSelected
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                    } ${isFromInventory ? 'ring-2 ring-blue-200' : ''}`}
                    title={isFromInventory ? 'Available in your inventory' : ''}
                  >
                    <span className="flex items-center justify-center gap-1">
                      {isSelected && <span className="text-green-600">✓</span>}
                      {ingredient}
                      {isFromInventory && <span className="text-blue-500 text-xs">•</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={generateRecipe}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              Generate Recipe
            </button>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-200"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  <h4 className="text-2xl font-bold text-gray-800 font-heading">
                    {recipe.name}
                  </h4>
                </div>
                
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                
                <div className="mb-4">
                  <h5 className="text-lg font-semibold text-green-600 mb-2">Ingredients:</h5>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold text-orange-600 mb-2">Steps:</h5>
                  <ol className="space-y-2">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-3 text-gray-600">
                        <span className="w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{step}</span>
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