const mongoose = require("mongoose");
require("dotenv").config();
const Menu = require("./models/Menu");

const defaultMenu = {
  Monday: { Breakfast: "Idli & Sambar", Lunch: "Rice + Dal + Sabji", Dinner: "Chapati + Paneer" },
  Tuesday: { Breakfast: "Poha + Tea", Lunch: "Wheat Roti + Mix Veg", Dinner: "Fried Rice + Manchurian" },
  Wednesday: { Breakfast: "Bread & Egg", Lunch: "Rice + Fish Curry", Dinner: "Roti + Dal Makhani" },
  Thursday: { Breakfast: "Upma + Coffee", Lunch: "Biryani + Raita", Dinner: "Chapati + Chana Masala" },
  Friday: { Breakfast: "Dosa + Chutney", Lunch: "Rice + Rasam + Papad", Dinner: "Puri + Sabji" },
  Saturday: { Breakfast: "Paratha + Curd", Lunch: "Special Meals", Dinner: "Pulao + Salad" },
  Sunday: { Breakfast: "Pancakes", Lunch: "Feast Meal", Dinner: "Sandwiches" }
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Seeding Menu Data...");
    for (const [day, meals] of Object.entries(defaultMenu)) {
      for (const [type, food] of Object.entries(meals)) {
        await Menu.findOneAndUpdate(
          { day, mealType: type },
          { foodItem: food },
          { upsert: true }
        );
      }
    }
    console.log("✅ Menu Seeding Complete!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
