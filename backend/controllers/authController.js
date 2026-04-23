const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const ALLOWED_ADMIN_EMAILS = ["rahulpatted02@gmail.com", "darshanhallur36198@gmail.com"];

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered. Please login instead." });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Restrict admin registration
    if (role === "admin" && !ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ message: "Unauthorized admin registration attempt." });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: role || "student",
    });
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error during registration: " + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res
        .status(400)
        .json({ message: "No account found with this email. Please register first." });

    // Restrict admin login
    if (user.role === "admin" && !ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return res.status(403).json({ message: "Unauthorized admin access." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password. Please try again." });

    if (user.status === "suspended") {
      return res.status(403).json({
        message:
          "Your account has been suspended by the campus administrator. Please contact support.",
      });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login: " + error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
};
