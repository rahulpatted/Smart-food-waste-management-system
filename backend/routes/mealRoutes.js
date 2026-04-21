const router = require("express").Router();
const Meal = require("../models/Meal");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/mealController");

router.post("/create", auth, controller.createMeal);
router.post("/register", auth, controller.registerMeal); 
router.post("/gift", auth, controller.giftMeal);
router.get("/summary", auth, controller.getDailyBookingsSummary);
router.get("/my-bookings", auth, controller.getMyBookings);
router.get("/forecast", controller.getForecast);

module.exports = router;