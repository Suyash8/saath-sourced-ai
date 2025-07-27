export const supplyTypes = [
  // Vegetables
  { id: "onions", name: "Onions", category: "Vegetables", unit: "kg" },
  { id: "tomatoes", name: "Tomatoes", category: "Vegetables", unit: "kg" },
  { id: "potatoes", name: "Potatoes", category: "Vegetables", unit: "kg" },
  {
    id: "green-chilies",
    name: "Green Chilies",
    category: "Vegetables",
    unit: "kg",
  },
  { id: "ginger", name: "Ginger", category: "Vegetables", unit: "kg" },
  { id: "garlic", name: "Garlic", category: "Vegetables", unit: "kg" },
  { id: "coriander", name: "Coriander", category: "Vegetables", unit: "kg" },
  { id: "mint", name: "Mint", category: "Vegetables", unit: "kg" },
  { id: "cabbage", name: "Cabbage", category: "Vegetables", unit: "kg" },
  {
    id: "cauliflower",
    name: "Cauliflower",
    category: "Vegetables",
    unit: "kg",
  },
  { id: "carrots", name: "Carrots", category: "Vegetables", unit: "kg" },
  {
    id: "bell-peppers",
    name: "Bell Peppers",
    category: "Vegetables",
    unit: "kg",
  },

  // Spices
  { id: "turmeric", name: "Turmeric Powder", category: "Spices", unit: "kg" },
  { id: "red-chili", name: "Red Chili Powder", category: "Spices", unit: "kg" },
  {
    id: "coriander-powder",
    name: "Coriander Powder",
    category: "Spices",
    unit: "kg",
  },
  { id: "cumin-powder", name: "Cumin Powder", category: "Spices", unit: "kg" },
  { id: "garam-masala", name: "Garam Masala", category: "Spices", unit: "kg" },
  { id: "black-pepper", name: "Black Pepper", category: "Spices", unit: "kg" },
  { id: "cardamom", name: "Cardamom", category: "Spices", unit: "kg" },
  { id: "cinnamon", name: "Cinnamon", category: "Spices", unit: "kg" },
  { id: "cloves", name: "Cloves", category: "Spices", unit: "kg" },
  { id: "bay-leaves", name: "Bay Leaves", category: "Spices", unit: "kg" },

  // Grains & Pulses
  { id: "rice", name: "Rice", category: "Grains & Pulses", unit: "kg" },
  {
    id: "wheat-flour",
    name: "Wheat Flour",
    category: "Grains & Pulses",
    unit: "kg",
  },
  {
    id: "chickpeas",
    name: "Chickpeas",
    category: "Grains & Pulses",
    unit: "kg",
  },
  {
    id: "lentils",
    name: "Lentils (Dal)",
    category: "Grains & Pulses",
    unit: "kg",
  },
  {
    id: "black-gram",
    name: "Black Gram (Urad Dal)",
    category: "Grains & Pulses",
    unit: "kg",
  },
  {
    id: "green-gram",
    name: "Green Gram (Moong Dal)",
    category: "Grains & Pulses",
    unit: "kg",
  },

  // Oils & Dairy
  {
    id: "cooking-oil",
    name: "Cooking Oil",
    category: "Oils & Dairy",
    unit: "liters",
  },
  { id: "ghee", name: "Ghee", category: "Oils & Dairy", unit: "kg" },
  { id: "milk", name: "Milk", category: "Oils & Dairy", unit: "liters" },
  { id: "yogurt", name: "Yogurt", category: "Oils & Dairy", unit: "kg" },
  { id: "paneer", name: "Paneer", category: "Oils & Dairy", unit: "kg" },

  // Proteins
  { id: "chicken", name: "Chicken", category: "Proteins", unit: "kg" },
  { id: "mutton", name: "Mutton", category: "Proteins", unit: "kg" },
  { id: "fish", name: "Fish", category: "Proteins", unit: "kg" },
  { id: "eggs", name: "Eggs", category: "Proteins", unit: "dozens" },

  // Packaged Items
  { id: "salt", name: "Salt", category: "Packaged Items", unit: "kg" },
  { id: "sugar", name: "Sugar", category: "Packaged Items", unit: "kg" },
  { id: "tea", name: "Tea", category: "Packaged Items", unit: "kg" },
  {
    id: "baking-soda",
    name: "Baking Soda",
    category: "Packaged Items",
    unit: "kg",
  },
  {
    id: "vinegar",
    name: "Vinegar",
    category: "Packaged Items",
    unit: "liters",
  },
];

export const supplyCategories = [
  "Vegetables",
  "Spices",
  "Grains & Pulses",
  "Oils & Dairy",
  "Proteins",
  "Packaged Items",
];

export type SupplyType = (typeof supplyTypes)[0];
export type UserRole = "vendor" | "supplier";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  vendorProfile?: {
    businessType: string;
    location: string;
    suppliesNeeded: string[];
    dailyCustomers: number;
    businessDescription: string;
  };
  supplierProfile?: {
    businessName: string;
    location: string;
    suppliesProvided: string[];
    capacity: number;
    businessDescription: string;
    minimumOrder: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
