require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./services/notificationService");

const morgan = require("morgan");
const logger = require("./utils/logger");

const app = express();
const server = http.createServer(app);

// HTTP request logging
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

// Initialize WebSockets securely using the service
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://smart-food-waste-management-system-2.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Initialize WebSockets securely using the service
initSocket(server);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10s timeout
  })
  .then(() => {
    logger.info("✅ MongoDB Atlas Connected Successfully");
    // Initialize Automated Inventory Scheduler
    require("./services/inventoryScheduler");
  })
  .catch((err) => {
    logger.error(
      "❌ MongoDB Connection Error. Please check if your IP is whitelisted in Atlas: %o",
      err
    );
  });

// Basic Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Smart Wastage Management System API is running successfully!" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
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

// DEBUG DB ROUTE
app.get("/api/debug/db", async (req, res) => {
  try {
    const userCount = await mongoose.model("User").countDocuments();
    res.json({
      status: "connected",
      database: mongoose.connection.name,
      userCount,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

logger.info("✅ ROUTES REGISTERED: /api/auth, /api/user, /api/admin/users (DIRECT)");

// Error handling middleware (MUST be after all routes)
app.use((err, req, res, _next) => {
  logger.error(err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// Export app for testing, conditionally listen
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => logger.info(`🚀 Server high-performance uplink on port ${PORT}`));
}

module.exports = app;
