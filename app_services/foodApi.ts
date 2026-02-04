import { FoodProduct } from '../types';

export const searchOpenFoodFacts = async (query: string): Promise<FoodProduct[]> => {
    if (!query) return [];

    try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`);
        const data = await response.json();

        return (data.products || [])
            .filter((p: any) => p.product_name && p.nutriments) // keep only valid 
            .map((p: any) => {
                //const name = p.product_name?.trim();
                //if (!name) return null; // skip if name is empty

                return {
                    id: p.id || Math.random().toString(36).substr(2, 9),
                    name: p.product_name,
                    calories: p.nutriments?.['energy-kcal_100g'] ?? 0,
                    protein: p.nutriments?.proteins_100g ?? 0,
                    fat: p.nutriments?.fat_100g ?? 0,
                    carbs: p.nutriments?.carbohydrates_100g ?? 0,
                    source: 'openfoodfacts',
                } as FoodProduct;
           })
            .filter(Boolean) as FoodProduct[]; // remove nulls
    } catch (error) {
        console.error('Error fetching Open Food Facts:', error);
        return [];
    }
};
