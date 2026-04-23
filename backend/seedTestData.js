require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Inventory = require("./models/Inventory");
const Donation = require("./models/Donation");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB. Seeding test data...");

    // 1. Create a Student and a Staff user to test Roles
    const studentExists = await User.findOne({ email: "student@foodsave.com" });
    if (!studentExists) {
      const sp = await bcrypt.hash("student123", 10);
      await User.create({
        name: "Demo Student",
        email: "student@foodsave.com",
        password: sp,
        role: "student",
      });
      console.log("✅ Created demo student account: student@foodsave.com / student123");
    }

    const staffExists = await User.findOne({ email: "staff@foodsave.com" });
    if (!staffExists) {
      const stp = await bcrypt.hash("staff123", 10);
      await User.create({
        name: "Demo Staff",
        email: "staff@foodsave.com",
        password: stp,
        role: "staff",
      });
      console.log("✅ Created demo staff account: staff@foodsave.com / staff123");
    }

    // 2. Add expiring inventory items for Smart Suggestions
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const twoDays = new Date(today);
    twoDays.setDate(twoDays.getDate() + 2);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Clear old inventory logic if desired, or just append
    await Inventory.create([
      { item: "Fresh Tomatoes", quantity: 15, unit: "kg", expiryDate: tomorrow },
      { item: "Whole Milk", quantity: 8, unit: "L", expiryDate: twoDays },
      { item: "Potatoes", quantity: 50, unit: "kg", expiryDate: nextWeek }, // Not expiring soon
      { item: "Carrots", quantity: 5, unit: "kg", expiryDate: nextWeek }, // Low stock (<10)
    ]);
    console.log(
      "✅ Seeded inventory (includes items expiring tomorrow to trigger Smart AI Suggestions & Low Stock alerts)"
    );

    // 3. Add sample donations for Kanban Board
    await Donation.create([
      { foodAmount: 15, location: "Main Campus Cafeteria", status: "Pending" },
      {
        foodAmount: 22,
        location: "North Wing Dining",
        status: "Assigned",
        ngoName: "City Food Bank",
      },
      {
        foodAmount: 10,
        location: "East Hostel Mess",
        status: "Picked Up",
        ngoName: "Hope Shelter",
      },
      {
        foodAmount: 30,
        location: "Main Campus Cafeteria",
        status: "Delivered",
        ngoName: "Community Kitchen",
      },
    ]);
    console.log("✅ Seeded Donation Kanban board with items in multiple stages");

    console.log("🎉 Seeding complete! You can now check the Inventory and Donations pages.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
