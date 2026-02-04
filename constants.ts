
import {FoodProduct,UserProfile } from './types';

export const INITIAL_FOOD_DATABASE: FoodProduct[] = [
  { id: '1', name: 'Chicken Breast', calories: 165, protein: 31, fat: 3.6, carbs: 0, source: 'local' },
  { id: '2', name: 'White Rice (Cooked)', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, source: 'local' },
  { id: '3', name: 'Broccoli', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, source: 'local' },
  { id: '4', name: 'Egg', calories: 155, protein: 13, fat: 11, carbs: 1.1, source: 'local' },
  { id: '5', name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, source: 'local' },
  { id: '6', name: 'Oats', calories: 389, protein: 16.9, fat: 6.9, carbs: 66.3, source: 'local' },
  { id: '7', name: 'Banana', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, source: 'local' },
  { id: '8', name: 'Peanut Butter', calories: 588, protein: 25, fat: 50, carbs: 20, source: 'local' },
];
export const ACTIVITY_LEVELS = [
    { value: 1.2, label: 'Sedentary (office job, little exercise)' },
    { value: 1.375, label: 'Lightly Active (exercise 1-3 days/week)' },
    { value: 1.55, label: 'Moderately Active (exercise 3-5 days/week)' },
    { value: 1.725, label: 'Very Active (hard exercise 6-7 days/week)' },
    { value: 1.9, label: 'Extra Active (very hard exercise & physical job)' },
];
