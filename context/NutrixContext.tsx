import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { UserProfile, FoodProduct, MealEntry, AppView, CalculatedRecipe } from "../types";
import { INITIAL_FOOD_DATABASE,ACTIVITY_LEVELS } from "../constants";
import { calculateDailyTarget, calculateDailyTotals, calculateRecipeNutrition } from "../utils";
import { searchOpenFoodFacts } from "../app_services/foodApi";
import { generateRecipe } from "../app_services/geminiService";

interface NutrixContextProps {
    view: AppView;
    setView: (v: AppView) => void;
    currentUser: UserProfile | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    pantry: string[];
    mealLogs: MealEntry[];
    foodDatabase: FoodProduct[];
    currentRecipe: CalculatedRecipe | null;
    isGeneratingRecipe: boolean;
    searchQuery: string;
    searchResults: FoodProduct[];
    isSearching: boolean;
    dailyTarget: number;
    activityLevels: typeof ACTIVITY_LEVELS;
    totals: ReturnType<typeof calculateDailyTotals>;
    macroData: { name: string; value: number; color: string }[];

    logout: () => void;
    addToPantry: (food: FoodProduct) => void;
    removeFromPantry: (name: string) => void;
    addMeal: (food: FoodProduct, grams: number) => void;
    performSearch: () => Promise<void>;
    triggerRecipeGen: () => Promise<void>;
    setSearchQuery: (query: string) => void;
    calculateDailyTarget: (profile: UserProfile) => number;
}

const NutrixContext = createContext<NutrixContextProps>({} as any);

export const NutrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [view, setView] = useState<AppView>('loginView'); //default view
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [foodDatabase, setFoodDatabase] = useState<FoodProduct[]>([]);
    const [pantry, setPantry] = useState<string[]>([]);
    const [mealLogs, setMealLogs] = useState<MealEntry[]>([]);
    const [currentRecipe, setCurrentRecipe] = useState<CalculatedRecipe | null>(null);
    const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // --- Initialization & LocalStorage Sync ---
    useEffect(() => {
        const savedUser = localStorage.getItem('nutrix_user');
        const savedFood = localStorage.getItem('nutrix_food');
        const savedPantry = localStorage.getItem('nutrix_pantry');
        const savedLogs = localStorage.getItem('nutrix_logs');

        if (savedUser) setCurrentUser(JSON.parse(savedUser));
        setFoodDatabase(savedFood ? JSON.parse(savedFood) : INITIAL_FOOD_DATABASE);
        setPantry(savedPantry ? JSON.parse(savedPantry) : []);
        setMealLogs(savedLogs ? JSON.parse(savedLogs) : []);
    }, []);

    useEffect(() => {
        if (currentUser) localStorage.setItem('nutrix_user', JSON.stringify(currentUser));
        localStorage.setItem('nutrix_food', JSON.stringify(foodDatabase));
        localStorage.setItem('nutrix_pantry', JSON.stringify(pantry));
        localStorage.setItem('nutrix_logs', JSON.stringify(mealLogs));
    }, [currentUser, foodDatabase, pantry, mealLogs]);

    // --- Handlers ---
    const logout = () => {
        localStorage.removeItem('nutrix_user');
        setCurrentUser(null);
        setView('loginView');
    };

    const addToPantry = (food: FoodProduct) => {
        if (!pantry.includes(food.name)) setPantry([...pantry, food.name]);
    };

    const removeFromPantry = (name: string) => {
        setPantry(pantry.filter(item => item !== name));
    };

    const addMeal = (food: FoodProduct, grams: number) => {
        const factor = grams / 100;
        const newEntry: MealEntry = {
            id: Math.random().toString(36).substr(2, 9),
            productId: food.id,
            name: food.name,
            grams,
            calories: Math.round(food.calories * factor),
            protein: Math.round(food.protein * factor),
            fat: Math.round(food.fat * factor),
            carbs: Math.round(food.carbs * factor),
            timestamp: Date.now()
        };
        setMealLogs([newEntry, ...mealLogs]);
        setView('dashboardView');
    };

    const performSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        const results = await searchOpenFoodFacts(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
    };

    const triggerRecipeGen = async () => {
        if (pantry.length === 0) return;
        setIsGeneratingRecipe(true);
        try {
            const recipe = await generateRecipe(pantry);
            const calculated = calculateRecipeNutrition(recipe, foodDatabase);
            setCurrentRecipe(calculated);
        } catch {
            alert("Failed to generate recipe. Please try again.");
        } finally {
            setIsGeneratingRecipe(false);
        }
    };

    // --- Computed values ---
    const dailyTarget = currentUser ? calculateDailyTarget(currentUser) : 2000;
    const todayLogs = useMemo(() => {
        const start = new Date().setHours(0, 0, 0, 0);
        return mealLogs.filter(log => log.timestamp >= start);
    }, [mealLogs]);

    const totals = useMemo(() => calculateDailyTotals(todayLogs), [todayLogs]);

    const macroData = [
        { name: 'Protein', value: totals.protein, color: '#3b82f6' },
        { name: 'Fat', value: totals.fat, color: '#ef4444' },
        { name: 'Carbs', value: totals.carbs, color: '#f59e0b' },
    ];

    return (
        <NutrixContext.Provider value={{
            view, setView, currentUser, setCurrentUser,pantry,activityLevels: ACTIVITY_LEVELS,
            mealLogs, foodDatabase, currentRecipe,
            isGeneratingRecipe, searchQuery, searchResults, isSearching, dailyTarget,
            totals, macroData, logout, addToPantry, removeFromPantry, addMeal,
            performSearch, triggerRecipeGen, setSearchQuery,calculateDailyTarget
        }}>
            {children}
        </NutrixContext.Provider>
    );
};

export const useNutrix = () => useContext(NutrixContext);
