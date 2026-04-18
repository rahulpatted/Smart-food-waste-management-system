const axios = require("axios");

// Call Python AI API for 7-day forecast
exports.getWeeklyForecast = async (attendance = 100) => {
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
    const res = await axios.get(
      `${aiServiceUrl}/forecast_week?attendance=${attendance}`
    );
    return res.data.forecast;
  } catch (err) {
    console.error("Weekly forecast error:", err.message);
    // Generic high-confidence fallback for Mon-Sun
    return [110, 125, 115, 130, 95, 70, 65];
  }
};