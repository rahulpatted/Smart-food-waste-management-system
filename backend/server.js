require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const errorHandler = require("./utils/errorHandler");
const { initSocket } = require("./services/notificationService");

const app = express();
const server = http.createServer(app);

// Initialize WebSockets securely using the service
app.use(cors());
app.use(express.json());

// Initialize WebSockets securely using the service
initSocket(server);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Atlas Connected via .env Successfully");
  // Initialize Automated Inventory Scheduler
  require("./services/inventoryScheduler");
})
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Basic Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Smart Wastage Management System API is running successfully!" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meals", require("./routes/mealRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/waste", require("./routes/wasteRoutes"));
app.use("/api/donation", require("./routes/donationRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));

// DEBUG ADMIN ROUTE - MOVED TO GLOBAL FOR 404 BYPASS
const userController = require("./controllers/userController");
const authMid = require("./middleware/authMiddleware");
const checkR = require("./middleware/roleMiddleware");
app.get("/api/admin/users", authMid, checkR(["admin", "ngo"]), userController.getAllUsers);

// PING TEST
app.get("/api/ping", (req, res) => res.json({ message: "pong", time: new Date() }));

console.log("✅ ROUTES REGISTERED: /api/auth, /api/user, /api/admin/users (DIRECT)");

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));