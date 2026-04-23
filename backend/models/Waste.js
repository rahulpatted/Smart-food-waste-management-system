const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema(
  {
    image: String,
    type: String,
    weight: Number,
    date: { type: Date, default: Date.now },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waste", wasteSchema);
