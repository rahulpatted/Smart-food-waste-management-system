const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  item: String,
  category: { type: String, default: "other" },
  quantity: Number,
  expiryDate: Date,
});

module.exports = mongoose.model("Inventory", inventorySchema);
