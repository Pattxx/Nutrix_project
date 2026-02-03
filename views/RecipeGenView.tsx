import React from "react";
import { ChefHat, Flame, Utensils, PlusCircle, ChevronRight, Dna, Wheat, Droplet } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";

const RecipeGenView: React.FC = () => {
    const { pantry, foodDatabase, currentRecipe, isGeneratingRecipe, setCurrentRecipe, setView, triggerRecipeGen, addMeal } = useNutrix();

    return (
        <div className="space-y-6 animate-in zoom-in duration-300">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">AI Chef</h2>
                <button
                    onClick={() => setView('pantryView')}
                    className="text-emerald-600 font-semibold hover:underline"
                >
                    Edit Pantry
                </button>
            </div>

            {/* Ready to cook */}
            {!currentRecipe && !isGeneratingRecipe && (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center shadow-sm">
                    <ChefHat className="w-20 h-20 text-emerald-600 mx-auto mb-6 opacity-40" />
                    <h3 className="text-2xl font-bold mb-2">Ready to cook?</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        I'll craft a unique recipe using only the {pantry.length} ingredients currently in your pantry.
                    </p>
                    <button
                        onClick={triggerRecipeGen}
                        className="px-10 py-4 bg-emerald-600 text-white text-lg font-bold rounded-2xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-200"
                    >
                        Get Cooking Suggestions
                    </button>
                </div>
            )}

            {/* Generating */}
            {isGeneratingRecipe && (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center shadow-sm">
                    <div className="animate-bounce flex justify-center mb-6">
                        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Consulting the AI Chef...</h3>
                    <p className="text-slate-500">I'm finding the perfect balance for your ingredients.</p>
                </div>
            )}

            {/* Generated recipe */}
            {currentRecipe && !isGeneratingRecipe && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recipe Details */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 bg-emerald-600 text-white">
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                                {currentRecipe.difficulty} Difficulty
                            </span>
                            <h3 className="text-3xl font-bold mb-2">{currentRecipe.name}</h3>
                            <div className="flex gap-6 mt-6">
                                <div className="flex items-center gap-2">
                                    <Flame size={18} />
                                    <span className="font-bold">{currentRecipe.totalCalories} kcal</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Utensils size={18} />
                                    <span>{currentRecipe.ingredients.length} items</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Ingredients */}
                            <div>
                                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <PlusCircle className="text-emerald-600" size={20} />
                                    Ingredients
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {currentRecipe.ingredients.map((ing, i) => (
                                        <li key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                            <span className="font-medium">{ing.name}</span>
                                            <span className="text-slate-500 font-bold">{ing.amountGrams}g</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Instructions */}
                            <div>
                                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <ChevronRight className="text-emerald-600" size={20} />
                                    Instructions
                                </h4>
                                <ol className="space-y-4">
                                    {currentRecipe.instructions.map((step, i) => (
                                        <li key={i} className="flex gap-4">
                                            <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                {i + 1}
                                            </span>
                                            <p className="text-slate-600 pt-1">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h4 className="text-lg font-bold mb-6">Nutritional Breakdown</h4>
                            <div className="space-y-6">
                                {/* Protein */}
                                <NutrientBar icon={<Dna />} label="Protein" value={currentRecipe.totalProtein} color="blue" widthPercent={40} />
                                {/* Carbs */}
                                <NutrientBar icon={<Wheat />} label="Carbs" value={currentRecipe.totalCarbs} color="amber" widthPercent={35} />
                                {/* Fat */}
                                <NutrientBar icon={<Droplet />} label="Fat" value={currentRecipe.totalFat} color="rose" widthPercent={25} />
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={() => {
                                currentRecipe.ingredients.forEach(ing => {
                                    const food = foodDatabase.find(f => f.name.toLowerCase().includes(ing.name.toLowerCase()));
                                    if (food) addMeal(food, ing.amountGrams);
                                });
                                alert("Recipe items added to your daily log!");
                                setView('dashboardView');
                            }}
                            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition"
                        >
                            Log this Recipe
                        </button>
                        <button
                            onClick={() => setCurrentRecipe(null)}
                            className="w-full py-4 bg-white text-slate-600 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition"
                        >
                            Try another combination
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const NutrientBar: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string; widthPercent: number }> = ({ icon, label, value, color, widthPercent }) => (
    <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-${color}-50 text-${color}-600 rounded-xl flex items-center justify-center`}>
            {icon}
        </div>
        <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-500 uppercase tracking-tighter text-xs">{label}</span>
                <span className="font-bold">{value}g</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`bg-${color}-500 h-full`} style={{ width: `${widthPercent}%` }} />
            </div>
        </div>
    </div>
);

export default RecipeGenView;
