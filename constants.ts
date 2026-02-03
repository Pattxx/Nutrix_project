
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

export const ACTIVITY_LEVELS = {
    sedentary: { label: 'Sedentary (little or no exercise)', factor: 1.2 },
    light: { label: 'Lightly active (1-2 days/week)', factor: 1.375 },
    moderate: { label: 'Moderately active (3-5 days/week)', factor: 1.55 },
    active: { label: 'Very active (6-7 days/week)', factor: 1.725 },
    veryActive: { label: 'Extra active (physical job/intense training)', factor: 1.9 }
};

export const calculateDailyTarget = (user: UserProfile): number => {
    const { weight, height, age, gender, activityLevel } = user;
    
    const genderOffset = gender === 'male' ? 5 : -161;
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + genderOffset;

    const factor = ACTIVITY_LEVELS[activityLevel as keyof typeof ACTIVITY_LEVELS]?.factor || 1.2;

    return Math.round(bmr * factor);
};