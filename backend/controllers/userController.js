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
  const timerLabel = `getUserStats Performance [${req.user.id}]`;
  console.time(timerLabel);
  try {
    const userId = req.user.id;

    // Use Promise.all to run non-dependent queries in parallel for better performance
    const [user, mealsBooked, donationsMade, volunteerCount, donations, totalUsers] = await Promise.all([
      User.findById(userId),
      Meal.countDocuments({ registeredStudents: userId }),
      Donation.countDocuments({ donorId: userId }),
      Donation.countDocuments({ volunteers: userId }),
      Donation.find({ donorId: userId, status: { $in: ["Delivered", "Claimed & Collected", "Assigned", "Pending"] } }),
      User.countDocuments({ role: "student" })
    ]);
    
    if (!user) {
      console.timeEnd(timerLabel);
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate food saved from donations
    const foodSavedKg = donations.reduce((acc, curr) => acc + (curr.foodAmount || 0), 0);
    
    // Rank calculation (Simplified for demo)
    const higherScoreUsers = await User.countDocuments({ role: "student", ecoScore: { $gt: user.ecoScore || 0 } });
    const rank = higherScoreUsers + 1;

    console.timeEnd(timerLabel);
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
    console.timeEnd(timerLabel);
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
