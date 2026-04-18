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
initSocket(server);

app.use(cors());
app.use(express.json());
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas Connected via .env Successfully"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Basic Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Smart Food Save API is running successfully!" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meals", require("./routes/mealRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/waste", require("./routes/wasteRoutes"));
app.use("/api/donation", require("./routes/donationRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));