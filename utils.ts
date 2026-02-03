
import { UserProfile, FoodProduct, MealEntry, AIRecipe, CalculatedRecipe } from './types';

/**
 * Calculate Daily Calorie Target using Mifflin-St Jeor Formula
 */
export const calculateDailyTarget = (profile: UserProfile): number => {
  const { age, weight, height, gender, activityLevel, goal } = profile;
  
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tdee = bmr * activityLevel;

  switch (goal) {
    case 'lose': return Math.round(tdee - 500);
    case 'gain': return Math.round(tdee + 500);
    default: return Math.round(tdee);
  }
};

/**
 * Calculate nutritional totals for a list of meal entries
 */
export const calculateDailyTotals = (entries: MealEntry[]) => {
  return entries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories,
    protein: acc.protein + entry.protein,
    fat: acc.fat + entry.fat,
    carbs: acc.carbs + entry.carbs,
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
};

/**
 * Calculate recipe nutrition based on our food database
 */
export const calculateRecipeNutrition = (recipe: AIRecipe, foodDatabase: FoodProduct[]): CalculatedRecipe => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  recipe.ingredients.forEach(ing => {
    // fuzzy search or exact match in our DB
    const food = foodDatabase.find(f => f.name.toLowerCase().includes(ing.name.toLowerCase())) 
                || foodDatabase.find(f => ing.name.toLowerCase().includes(f.name.toLowerCase()));
    
    if (food) {
      const factor = ing.amountGrams / 100;
      totalCalories += food.calories * factor;
      totalProtein += food.protein * factor;
      totalFat += food.fat * factor;
      totalCarbs += food.carbs * factor;
    }
  });

  return {
    ...recipe,
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein),
    totalFat: Math.round(totalFat),
    totalCarbs: Math.round(totalCarbs)
  };
};

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString();
};
