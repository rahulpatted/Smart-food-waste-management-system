const User = require("../models/User");
const Meal = require("../models/Meal");
const Donation = require("../models/Donation");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, location, profilePicture },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile", error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // Calculate stats depending on role
    const mealsBooked = await Meal.countDocuments({ registeredStudents: userId });
    const donationsMade = await Donation.countDocuments({ donorId: userId });
    const volunteerCount = await Donation.countDocuments({ volunteers: userId });
    
    // Calculate food saved from donations
    const donations = await Donation.find({ donorId: userId, status: { $in: ["Delivered", "Claimed & Collected", "Assigned", "Pending"] } });
    const foodSavedKg = donations.reduce((acc, curr) => acc + (curr.foodAmount || 0), 0);
    
    // Rank calculation (Simplified for demo)
    const totalUsers = await User.countDocuments({ role: "student" });
    const higherScoreUsers = await User.countDocuments({ role: "student", ecoScore: { $gt: user.ecoScore || 0 } });
    const rank = higherScoreUsers + 1;

    res.json({
      mealsBooked,
      donationsMade,
      volunteerCount,
      foodSaved: foodSavedKg,
      requestsCompleted: donations.filter(d => d.status === "Delivered").length,
      ecoScore: user.ecoScore || 0,
      achievements: user.achievements || [],
      rank: `${rank}/${totalUsers}`
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching stats", error: error.message });
  }
};

// Admin & Staff: Get all users (Staff primarily for partner directory)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Admin: Toggle user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user status", error: error.message });
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User successfully removed from system" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
