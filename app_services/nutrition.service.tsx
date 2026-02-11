import { FoodProduct, MealEntry, UserProfile } from "../types";
import { ACTIVITY_LEVELS } from "../constants";

export function calculateMeal(
    food: FoodProduct,
    grams: number
): MealEntry {
    const factor = grams / 100;

    return {
        id: Math.random().toString(36).substr(2, 9),
        productId: food.id,
        name: food.name,
        grams,
        calories: Math.round(food.calories * factor),
        protein: Math.round(food.protein * factor),
        fat: Math.round(food.fat * factor),
        carbs: Math.round(food.carbs * factor),
        timestamp: Date.now(),
    };
}


export function calculateDailyTotals(meals: MealEntry[]) {
    return meals.reduce(
        (acc, meal) => {
            acc.calories += meal.calories;
            acc.protein += meal.protein;
            acc.fat += meal.fat;
            acc.carbs += meal.carbs;
            return acc;
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
}


export function calculateDailyTarget(user: UserProfile): number {
    const { weight, height, age, gender, activityLevel } = user;

    const bmr =
        gender === "male"
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;

    return Math.round(bmr * activityLevel);
}
export function calculateRecipeNutrition(
    recipe: {
        ingredients: { name: string; grams: number }[];
    },
    foodDatabase: FoodProduct[]
) {
    let totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

    recipe.ingredients.forEach((ing) => {
        const food = foodDatabase.find(
            (f) => f.name.toLowerCase() === ing.name.toLowerCase()
        );
        if (!food) return;

        const factor = ing.grams / 100;
        totals.calories += food.calories * factor;
        totals.protein += food.protein * factor;
        totals.fat += food.fat * factor;
        totals.carbs += food.carbs * factor;
    });

    return {
        ...recipe,
        totals: {
            calories: Math.round(totals.calories),
            protein: Math.round(totals.protein),
            fat: Math.round(totals.fat),
            carbs: Math.round(totals.carbs),
        },
    };
}
