const Meal = require("../models/Meal");
const { getMealForecast } = require("../services/forecastService");

exports.registerMeal = async (req, res) => {
  try {
    const { mealId } = req.body;
    // Use authenticated user ID
    const studentId = req.user.id;
    
    let meal = await Meal.findById(mealId).catch(() => null);
    if (!meal) {
        // Fallback search by type for current day if ID fails
        const today = new Date();
        today.setHours(0,0,0,0);
        meal = await Meal.findOne({ mealType: mealId, date: { $gte: today } });
        
        if (!meal) {
          meal = await Meal.create({ mealType: mealId, date: new Date(), predictedCount: 100 });
        }
    }

    // Check if already registered
    if (meal.registeredStudents.includes(studentId)) {
      return res.status(400).json({ message: "Already booked for this meal" });
    }

    meal.registeredStudents.push(studentId);
    await meal.save();

    // Reward EcoScore for commitment (Pre-booking)
    const User = require("../models/User");
    await User.findByIdAndUpdate(studentId, { $inc: { ecoScore: 10 } });

    res.json({ message: "Meal portion secured successfully. +10 EcoPoints earned!", meal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error registering meal" });
  }
};

exports.getDailyBookingsSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Get all meals for today or future
    const meals = await Meal.find({ date: { $gte: today } });
    
    const summary = {
      Breakfast: 0,
       Lunch: 0,
       Dinner: 0
    };

    meals.forEach(m => {
      if (summary.hasOwnProperty(m.mealType)) {
        summary[m.mealType] += m.registeredStudents.length;
      }
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Failed to load meal summary" });
  }
};

exports.getForecast = async (req, res) => {
  try {
    const { attendance = 100 } = req.query;
    const forecast = await getWeeklyForecast(attendance);
    res.json({ forecast });
  } catch (err) {
    res.status(500).json({ message: "Failed to load forecast" });
  }
};


exports.createMeal = async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: "Error creating meal" });
  }
};

exports.giftMeal = async (req, res) => {
  try {
    const { mealId } = req.body;
    const studentId = req.user.id;
    
    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: "Meal record not found" });

    // Check if registered
    if (!meal.registeredStudents.includes(studentId)) {
       return res.status(400).json({ message: "You don't have a booking for this meal" });
    }

    // Remove student
    meal.registeredStudents = meal.registeredStudents.filter(id => id.toString() !== studentId);
    await meal.save();

    // Reward EcoScore for releasing (Gifting)
    const User = require("../models/User");
    await User.findByIdAndUpdate(studentId, { $inc: { ecoScore: 50 } });

    res.json({ message: "Meal successfully gifted back to the community! +50 EcoPoints earned.", meal });
  } catch (err) {
    res.status(500).json({ message: "Error gifting meal", error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const bookings = await Meal.find({ 
      registeredStudents: userId,
      date: { $gte: today }
    }).sort({ date: 1 });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching personal bookings", error: err.message });
  }
};