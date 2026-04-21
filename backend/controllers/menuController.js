const Menu = require("../models/Menu");

exports.getWeeklyMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu", error: error.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { day, mealType, foodItem } = req.body;
    
    const menuItem = await Menu.findOneAndUpdate(
      { day, mealType },
      { foodItem, updatedBy: req.user.id },
      { upsert: true, new: true }
    );
    
    res.json({ message: "Menu updated successfully", menuItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating menu", error: error.message });
  }
};
