import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { role, businessType, location } = await request.json();

    // This would typically call an AI service like OpenAI
    // For now, I'll create intelligent suggestions based on business type and role

    let suggestions: string[] = [];

    if (role === "vendor") {
      suggestions = generateVendorSuggestions(businessType, location);
    } else if (role === "supplier") {
      suggestions = generateSupplierSuggestions(businessType, location);
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}

function generateVendorSuggestions(
  businessType: string,
  location: string
): string[] {
  const suggestions: string[] = [];

  // Based on business type, suggest relevant supplies
  if (businessType.toLowerCase().includes("chaat")) {
    suggestions.push(
      "Consider stocking tamarind water and mint for authentic flavors",
      "Green chilies and onions are essential for most chaat preparations",
      "Sev and puffed rice are staple ingredients you'll need regularly"
    );
  } else if (businessType.toLowerCase().includes("dosa")) {
    suggestions.push(
      "Rice and black gram are your primary ingredients",
      "Coconut and curry leaves for sambhar preparation",
      "Onions and green chilies for various chutneys"
    );
  } else if (businessType.toLowerCase().includes("tea")) {
    suggestions.push(
      "Quality tea leaves will determine your customer satisfaction",
      "Fresh milk supply is crucial for tea business",
      "Sugar, ginger, and cardamom for flavored tea variants"
    );
  } else {
    // Generic street food suggestions
    suggestions.push(
      "Onions and tomatoes are versatile ingredients for most street foods",
      "Keep a variety of spices for authentic flavors",
      "Consider bulk buying cooking oil to reduce costs"
    );
  }

  // Location-based suggestions
  if (location.toLowerCase().includes("mumbai")) {
    suggestions.push(
      "Mumbai customers often prefer spicy food - stock extra green chilies",
      "Consider vada pav ingredients if not already on your menu"
    );
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
}

function generateSupplierSuggestions(
  businessType: string,
  location: string
): string[] {
  const suggestions: string[] = [];

  if (businessType.toLowerCase().includes("farm")) {
    suggestions.push(
      "Focus on seasonal vegetables that grow well in your region",
      "Consider organic certification to attract premium customers",
      "Build relationships with multiple vendors for steady demand"
    );
  } else if (businessType.toLowerCase().includes("wholesale")) {
    suggestions.push(
      "Maintain consistent quality to build vendor trust",
      "Offer flexible payment terms for regular customers",
      "Consider value-added services like pre-cutting vegetables"
    );
  } else {
    suggestions.push(
      "Ensure reliable supply chain to meet vendor demands",
      "Competitive pricing with quality products builds long-term relationships",
      "Consider seasonal pricing strategies"
    );
  }

  return suggestions.slice(0, 3);
}
