import express from "express";
import { GoogleGenAI } from '@google/genai';
import { API_BASE_URL } from '../src';
const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//deleted the raw fetch, now using google genai sdk

router.post(`${API_BASE_URL}/api/recipe/generate`, async (req, res) => {
    const { pantry } = req.body;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "Server API key is missing" });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    parts: [
                        {
                            text: `Create a recipe in JSON format with the following ingredients: ${pantry.join(", ")}.
                            Return strictly JSON matching this structure:
                            {
                              "name": "Recipe name",
                              "grams": number,
                              "ingredients": [{"name": "ingredient name", "amountGrams": number}],
                              "instructions": ["Step 1", "Step 2"],
                              "difficulty": "Easy" | "Medium" | "Hard",
                              "totalCalories": number,
                              "totalProtein": number,
                              "totalFat": number,
                              "totalCarbs": number
                            }

                            The "totalCalories", "totalProtein", "totalFat", and "totalCarbs" must be **calculated based on the ingredient amounts**.
                            Do not include any text outside this JSON.`
                        }
                    ]
                }
            ]
        });
console.log("Raw recipeText from Gemini:", recipeText);
   
        let recipeText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        recipeText = recipeText.replace(/```json/g, "").replace(/```/g, "").trim();

        if (!recipeText) {
            console.error("Gemini returned empty recipe text", result);
            return res.status(500).json({
                error: "Empty response from Gemini",
                details: "No recipe text returned"
            });
        }

        let recipe;
        try {
            recipe = JSON.parse(recipeText);
        } catch (err) {
            console.error("Failed to parse JSON from Gemini:", err, recipeText);
            return res.status(500).json({
                error: "Failed to parse recipe JSON",
                details: err.message
            });
        }

        if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
            console.error("Invalid recipe structure", recipe);
            return res.status(500).json({
                error: "Invalid recipe structure",
                details: "Missing ingredients array"
            });
        }
        //console.log("Parsed recipe from Gemini:", recipe);

        res.json(recipe);

    } catch (err) {
        console.error("Gemini SDK error:", err);
        res.status(500).json({
            error: "Failed to generate recipe",
            details: err.message
        });
    }
});



export default router;
