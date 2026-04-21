const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  foodAmount: { type: Number, required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: { type: String, enum: ["Pending", "Assigned", "Claimed & Collected", "Delivered"], default: "Pending" },
  destination: { type: String, default: null },
  deliveryProof: { type: String, default: null }, // Base64 or Image URL
  deliveryCoordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  ngoName: { type: String, default: null },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  archived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);