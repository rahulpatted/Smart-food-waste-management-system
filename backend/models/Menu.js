const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  mealType: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Dinner"]
  },
  foodItem: {
    type: String,
    required: true,
    default: "TBD"
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Ensure unique combination of day and mealType
menuSchema.index({ day: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model("Menu", menuSchema);
