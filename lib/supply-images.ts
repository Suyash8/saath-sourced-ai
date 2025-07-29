export const getDefaultSupplyImage = (productName: string): string => {
  const imageMap: Record<string, string> = {
    // Vegetables
    Onions:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop&crop=center",
    Tomatoes:
      "https://images.unsplash.com/photo-1546470427-e26dd1fdb2b7?w=400&h=300&fit=crop&crop=center",
    Potatoes:
      "https://images.unsplash.com/photo-1598466999162-7582e6800212?w=400&h=300&fit=crop&crop=center",
    Garlic:
      "https://images.unsplash.com/photo-1513369955618-bb8ee4cdeb1c?w=400&h=300&fit=crop&crop=center",
    Ginger:
      "https://images.unsplash.com/photo-1595750473673-c4bfc2d7eeef?w=400&h=300&fit=crop&crop=center",
    "Green Chilies":
      "https://images.unsplash.com/photo-1592281402382-8e5d6a21045b?w=400&h=300&fit=crop&crop=center",
    Coriander:
      "https://images.unsplash.com/photo-1584571045112-0a4f149b3ca8?w=400&h=300&fit=crop&crop=center",
    Vegetables:
      "https://images.unsplash.com/photo-1572035945544-7ed2e61089ea?w=400&h=300&fit=crop&crop=center",

    // Grains & Staples
    Rice: "https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=400&h=300&fit=crop&crop=center",
    "Basmati Rice":
      "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=400&h=300&fit=crop&crop=center",
    "Wheat Flour":
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    "Lentils (Dal)":
      "https://images.unsplash.com/photo-1601542097949-36adb93a4d2b?w=400&h=300&fit=crop&crop=center",
    Chickpeas:
      "https://images.unsplash.com/photo-1582049565613-40dd84f60ca7?w=400&h=300&fit=crop&crop=center",
    Pulses:
      "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&h=300&fit=crop&crop=center",

    // Oils & Fats
    "Oil (Cooking)":
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop&crop=center",
    "Coconut Oil":
      "https://images.unsplash.com/photo-1564073347429-ca2e0ff9e8b2?w=400&h=300&fit=crop&crop=center",
    "Mustard Oil":
      "https://images.unsplash.com/photo-1544418219-4cb3b7d0b319?w=400&h=300&fit=crop&crop=center",
    Ghee: "https://images.unsplash.com/photo-1596510117085-c6b8b9a03cec?w=400&h=300&fit=crop&crop=center",
    Butter:
      "https://images.unsplash.com/photo-1589985269317-83bb580312a4?w=400&h=300&fit=crop&crop=center",

    // Spices
    Cumin:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&crop=center",
    Turmeric:
      "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400&h=300&fit=crop&crop=center",
    "Red Chili Powder":
      "https://images.unsplash.com/photo-1583662592995-6b3c97b5a9b8?w=400&h=300&fit=crop&crop=center",
    "Garam Masala":
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&crop=center",
    Cardamom:
      "https://images.unsplash.com/photo-1603048674889-bb1dd5b79a4b?w=400&h=300&fit=crop&crop=center",
    Cinnamon:
      "https://images.unsplash.com/photo-1518086989353-6c9b8cd4c4df?w=400&h=300&fit=crop&crop=center",
    "Black Pepper":
      "https://images.unsplash.com/photo-1581621384831-78ac3dd49431?w=400&h=300&fit=crop&crop=center",
    "Bay Leaves":
      "https://images.unsplash.com/photo-1548113885-36ce37be1945?w=400&h=300&fit=crop&crop=center",
    Fenugreek:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&crop=center",
    "Mustard Seeds":
      "https://images.unsplash.com/photo-1581621384831-78ac3dd49431?w=400&h=300&fit=crop&crop=center",
    Spices:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&crop=center",

    // Dairy & Proteins
    Milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&crop=center",
    Paneer:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&crop=center",
    Yogurt:
      "https://images.unsplash.com/photo-1593360372912-7a6a88e4de05?w=400&h=300&fit=crop&crop=center",
    Eggs: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&h=300&fit=crop&crop=center",
    Chicken:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&crop=center",
    Fish: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop&crop=center",
    Meat: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop&crop=center",

    // Others
    Salt: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400&h=300&fit=crop&crop=center",
    Sugar:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center",
    "Tea Leaves":
      "https://images.unsplash.com/photo-1597318181409-e95ebf725055?w=400&h=300&fit=crop&crop=center",
    Bread:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center",
    Fruits:
      "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=400&h=300&fit=crop&crop=center",
    "Dry Fruits":
      "https://images.unsplash.com/photo-1573144813195-96e5154b064a?w=400&h=300&fit=crop&crop=center",
    Cashews:
      "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400&h=300&fit=crop&crop=center",
    Almonds:
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=300&fit=crop&crop=center",
  };

  return (
    imageMap[productName] ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center"
  );
};
