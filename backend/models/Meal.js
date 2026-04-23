const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  date: Date,
  mealType: String,
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  predictedCount: Number,
  actualCount: Number,
});

module.exports = mongoose.model("Meal", mealSchema);
