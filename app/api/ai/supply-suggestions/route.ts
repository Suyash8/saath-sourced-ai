import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { businessDescription, businessType, isSupplier } = await req.json();

    if (!businessDescription || !businessType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const supplyTypes = [
      "Rice",
      "Wheat Flour",
      "Oil (Cooking)",
      "Onions",
      "Tomatoes",
      "Potatoes",
      "Garlic",
      "Ginger",
      "Green Chilies",
      "Coriander",
      "Cumin",
      "Turmeric",
      "Red Chili Powder",
      "Garam Masala",
      "Salt",
      "Sugar",
      "Tea Leaves",
      "Milk",
      "Paneer",
      "Yogurt",
      "Lentils (Dal)",
      "Chickpeas",
      "Spices",
      "Vegetables",
      "Fruits",
      "Meat",
      "Chicken",
      "Fish",
      "Eggs",
      "Bread",
      "Butter",
      "Ghee",
      "Coconut Oil",
      "Mustard Oil",
      "Basmati Rice",
      "Pulses",
      "Dry Fruits",
      "Cashews",
      "Almonds",
      "Cardamom",
      "Cinnamon",
      "Black Pepper",
      "Bay Leaves",
      "Fenugreek",
      "Mustard Seeds",
    ];

    const prompt = isSupplier
      ? `Based on this business description: "${businessDescription}" for a ${businessType}, suggest the most relevant supplies/products they would likely PROVIDE/SUPPLY to others. Return only a JSON array of strings, selecting from this list: ${JSON.stringify(
          supplyTypes
        )}. Focus on what they would supply, not what they need. Example: ["Rice", "Wheat Flour", "Oil (Cooking)"]`
      : `Based on this business description: "${businessDescription}" for a ${businessType}, suggest the most relevant supplies/ingredients they would likely NEED for their business. Return only a JSON array of strings, selecting from this list: ${JSON.stringify(
          supplyTypes
        )}. Focus on ingredients and supplies they would purchase. Example: ["Rice", "Wheat Flour", "Oil (Cooking)"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[.*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in AI response");
    }

    const suggestions = JSON.parse(jsonMatch[0]);

    // Validate that all suggestions are from our list
    const validSuggestions = suggestions.filter((item: string) =>
      supplyTypes.includes(item)
    );

    return NextResponse.json({
      suggestions: validSuggestions.slice(0, 8), // Limit to 8 suggestions
    });
  } catch (error) {
    console.error("Error generating supply suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
