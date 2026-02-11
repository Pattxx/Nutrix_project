
//import { GoogleGenAI, Type } from "@google/genai";
//import { AIRecipe } from "../types";

//export const generateRecipe = async (ingredients: string[]): Promise<AIRecipe> => {
//  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
//  const prompt = `Create a healthy recipe using ONLY some or all of the following ingredients: ${ingredients.join(', ')}. 
//  You may assume basic staples like water, salt, and pepper are available.
//  Provide realistic gram amounts for the ingredients so nutritional value can be calculated accurately.`;

//  const response = await ai.models.generateContent({
//    model: "gemini-3-flash-preview",
//    contents: prompt,
//    config: {
//      responseMimeType: "application/json",
//      responseSchema: {
//        type: Type.OBJECT,
//        properties: {
//          name: { type: Type.STRING },
//          ingredients: {
//            type: Type.ARRAY,
//            items: {
//              type: Type.OBJECT,
//              properties: {
//                name: { type: Type.STRING },
//                amountGrams: { type: Type.NUMBER }
//              },
//              required: ["name", "amountGrams"]
//            }
//          },
//          instructions: {
//            type: Type.ARRAY,
//            items: { type: Type.STRING }
//          },
//          difficulty: { 
//            type: Type.STRING,
//            description: "One of: Easy, Medium, Hard"
//          }
//        },
//        required: ["name", "ingredients", "instructions", "difficulty"]
//      }
//    }
//  });

//  try {
//    return JSON.parse(response.text);
//  } catch (e) {
//    console.error("Failed to parse AI response", e);
//    throw new Error("Invalid recipe format received from AI");
//  }
//};
