
export interface UserProfile {
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female';
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
  email?: string;
}

export interface FoodProduct {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number; // per 100g
  fat: number; // per 100g
  carbs: number; // per 100g
  source: 'local' | 'openfoodfacts';
}

export interface MealEntry {
  id: string;
  productId: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  timestamp: number;
}

export interface RecipeIngredient {
  name: string;
  amountGrams: number;
}

export interface AIRecipe {
  name: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CalculatedRecipe extends AIRecipe {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export type AppView = 'loginView' | 'registerView' | 'dashboardView' | 'pantryView' | 'recipeGenView' | 'historyView' | 'profileView' | 'weeklyView';
