const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "staff", "admin", "donor", "ngo", "volunteer"],
      default: "student",
    },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    ecoScore: { type: Number, default: 0 },
    achievements: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
