import React, { useState } from "react";
import { Search, ChefHat, Trash2, PlusCircle } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";
import { FoodProduct } from "../types";
import { searchOpenFoodFacts } from "../app_services/foodApi";

const PantryView: React.FC = () => {
    const { pantry, addToPantry, removeFromPantry, addMeal, setView } = useNutrix();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const performSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const results = await searchOpenFoodFacts(searchQuery);
            setSearchResults(results);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch products. Try again.");
        } finally {
            setIsSearching(false);
        }
    };


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold">My Pantry</h2>
            <p className="text-slate-500">Search for ingredients and add them to your daily log or pantry.</p>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                    />
                </div>
                <button
                    onClick={performSearch}
                    className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
                    disabled={isSearching}
                >
                    {isSearching ? '...' : 'Search'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
                    <h3 className="text-lg font-bold mb-4">Results</h3>
                    <div className="space-y-3">
                        {searchResults.length === 0 && !isSearching && (
                            <div className="text-center py-12 text-slate-400">
                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Start searching for foods</p>
                            </div>
                        )}
                        {searchResults.map((res) => (
                            <div key={res.id} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 flex justify-between items-center group transition">
                                <div>
                                    <p className="font-bold">{res.name}</p>
                                    <p className="text-xs text-slate-400">
                                        {res.calories} kcal
                                        <br />
                                        Protein: {res.protein}g  Fat: {res.fat}g  Carbs: {res.carbs}g
                                    </p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={() => addToPantry(res.name)} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100">
                                        <ChefHat size={18} />
                                    </button>
                                    <button onClick={() => {
                                        const g = prompt("How many grams?", "100");
                                        if (g) addMeal(res, parseInt(g));
                                    }} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                                        <PlusCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Ingredients I Have</h3>
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">{pantry.length} Items</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {pantry.length === 0 && (
                            <p className="text-slate-400 text-sm italic">Pantry is empty. Add ingredients to generate AI recipes.</p>
                        )}
                        {pantry.map((item, index) => (
                            <span
                                key={`${item}-${index}`}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                                {item}
                                <button
                                    onClick={() => removeFromPantry(item)}
                                    className="text-slate-400 hover:text-red-500 transition">
                                    <Trash2 size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                    {pantry.length > 0 && (
                        <button
                            onClick={() => setView('recipeGenView')}
                            className="mt-8 w-full py-3 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                            <ChefHat size={20} />
                            Generate Recipes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PantryView;
