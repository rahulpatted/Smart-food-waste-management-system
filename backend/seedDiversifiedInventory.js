const mongoose = require("mongoose");
const Inventory = require("./models/Inventory");
require("dotenv").config();

const items = [
  // Vegetables (10 items)
  {
    item: "Fresh Carrots",
    category: "vegetables",
    quantity: 50,
    expiryDate: new Date("2026-05-15"),
  },
  {
    item: "Russet Potatoes",
    category: "vegetables",
    quantity: 120,
    expiryDate: new Date("2026-06-20"),
  },
  {
    item: "Organic Spinach",
    category: "vegetables",
    quantity: 35,
    expiryDate: new Date("2026-05-05"),
  },
  {
    item: "Red Tomatoes",
    category: "vegetables",
    quantity: 40,
    expiryDate: new Date("2026-05-10"),
  },
  { item: "Broccoli", category: "vegetables", quantity: 25, expiryDate: new Date("2026-05-12") },
  {
    item: "Bell Peppers",
    category: "vegetables",
    quantity: 30,
    expiryDate: new Date("2026-05-18"),
  },
  { item: "Cabbage", category: "vegetables", quantity: 20, expiryDate: new Date("2026-06-01") },
  { item: "Onions", category: "vegetables", quantity: 80, expiryDate: new Date("2026-07-01") },
  { item: "Garlic", category: "vegetables", quantity: 15, expiryDate: new Date("2026-08-01") },
  { item: "Ginger", category: "vegetables", quantity: 10, expiryDate: new Date("2026-08-15") },

  // Fruits (8 items)
  { item: "Red Apples", category: "fruits", quantity: 65, expiryDate: new Date("2026-05-30") },
  { item: "Navel Oranges", category: "fruits", quantity: 55, expiryDate: new Date("2026-06-05") },
  { item: "Ripe Bananas", category: "fruits", quantity: 40, expiryDate: new Date("2026-05-01") },
  { item: "Grapes", category: "fruits", quantity: 25, expiryDate: new Date("2026-05-08") },
  { item: "Mangoes", category: "fruits", quantity: 30, expiryDate: new Date("2026-05-25") },
  { item: "Pineapple", category: "fruits", quantity: 15, expiryDate: new Date("2026-05-15") },
  { item: "Watermelon", category: "fruits", quantity: 10, expiryDate: new Date("2026-05-20") },
  { item: "Pomegranate", category: "fruits", quantity: 20, expiryDate: new Date("2026-06-15") },

  // Dairy (6 items)
  { item: "Amul Milk (1L)", category: "dairy", quantity: 45, expiryDate: new Date("2026-05-02") },
  { item: "Amul Butter", category: "dairy", quantity: 25, expiryDate: new Date("2026-05-25") },
  { item: "Greek Yogurt", category: "dairy", quantity: 15, expiryDate: new Date("2026-05-10") },
  { item: "Cheddar Cheese", category: "dairy", quantity: 10, expiryDate: new Date("2026-07-01") },
  { item: "Paneer (Fresh)", category: "dairy", quantity: 20, expiryDate: new Date("2026-05-05") },
  { item: "Whipping Cream", category: "dairy", quantity: 5, expiryDate: new Date("2026-05-15") },

  // Grains & Daily (6 items)
  {
    item: "Basmati Rice (5kg)",
    category: "grains",
    quantity: 100,
    expiryDate: new Date("2027-01-01"),
  },
  {
    item: "Whole Wheat Flour",
    category: "grains",
    quantity: 80,
    expiryDate: new Date("2026-12-01"),
  },
  { item: "Brown Bread", category: "daily", quantity: 15, expiryDate: new Date("2026-05-01") },
  { item: "White Bread", category: "daily", quantity: 20, expiryDate: new Date("2026-05-01") },
  { item: "Free Range Eggs", category: "daily", quantity: 60, expiryDate: new Date("2026-05-20") },
  { item: "Rolled Oats", category: "grains", quantity: 30, expiryDate: new Date("2026-10-01") },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for high-fidelity seeding...");

    // Explicitly delete ALL inventory items
    const delResult = await Inventory.deleteMany({});
    console.log(`Cleared ${delResult.deletedCount} legacy inventory items.`);

    // Insert new items
    await Inventory.insertMany(items);
    console.log(`Successfully seeded ${items.length} clean items with full categories!`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
