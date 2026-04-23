const Inventory = require("../models/Inventory");
const { sendAlert } = require("../services/notificationService");

exports.addItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add inventory item" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load inventory" });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Inventory.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    // 🔔 LOW STOCK ALERT
    if (quantity < 5) {
      sendAlert(`Low stock: ${item.item}`);
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update item stock" });
  }
};
