const Waste = require("../models/Waste");
const { sendAlert } = require("../services/notificationService");
const { sendHighWasteEmail } = require("../services/emailService");

exports.addWaste = async (req, res) => {
  try {
    const waste = await Waste.create(req.body);

    // High waste alert threshold
    if (waste.weight > 20) {
      sendAlert(`🚨 Alert: A massive ${waste.weight}kg of ${waste.type} waste was just logged!`);
      sendHighWasteEmail(waste);
    }

    res.json(waste);
  } catch (error) {
    res.status(500).json({ message: "Error adding waste log", error: error.message });
  }
};

exports.getWasteLogs = async (req, res) => {
  try {
    const data = await Waste.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error routing waste logs" });
  }
};

exports.getWasteStats = async (req, res) => {
  try {
    const data = await Waste.aggregate([
      {
        $group: {
          _id: "$type",
          totalWeight: { $sum: "$weight" },
        },
      },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error aggregating waste statistics" });
  }
};
