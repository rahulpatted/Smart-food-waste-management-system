const Donation = require("../models/Donation");
const { sendAlert } = require("../services/notificationService");

exports.createDonation = async (req, res) => {
  try {
    // Set donorId from the authenticated user for security
    const donation = await Donation.create({
      ...req.body,
      donorId: req.user.id
    });
    // Alert only NGOs that new food is available in their sector
    sendAlert(`🤝 New Surplus Food Available: ${donation.foodAmount}kg at ${donation.location}`, "ngo");
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: "Error creating donation", error: err.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    // Only return non-archived records for the live board
    const donations = await Donation.find({ archived: { $ne: true } }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching donations", error: err.message });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ngoName, destination, deliveryProof, deliveryCoordinates } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id;

    const donation = await Donation.findById(id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // --- STRICT WORKFLOW LOGIC ---
    
    // 1. Pending -> Assigned (Claiming)
    if (status === "Assigned") {
      if (userRole !== "ngo" && userRole !== "admin") {
        return res.status(403).json({ message: "Only NGOs can claim donations." });
      }
    }

    // 2. Assigned -> Claimed & Collected (Handoff)
    if (status === "Claimed & Collected") {
      if (donation.donorId?.toString() !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "Only the original donor can confirm the physical hand-over." });
      }
    }

    // 3. Claimed & Collected -> Delivered (Distribution)
    if (status === "Delivered") {
      // NGO who claimed it OR original donor (Staff) OR admin
      const isClaimer = donation.ngoName === (req.user.name || req.user.email);
      const isDonor = donation.donorId?.toString() === userId;
      
      if (!isClaimer && !isDonor && userRole !== "admin") {
        return res.status(403).json({ message: "Only the assigned NGO or the original Staff donor can mark this as delivered." });
      }
    }

    // Prepare update object
    const updateData = { status };
    if (ngoName) updateData.ngoName = ngoName;
    if (destination) updateData.destination = destination;
    if (deliveryProof) updateData.deliveryProof = deliveryProof;
    if (deliveryCoordinates) updateData.deliveryCoordinates = deliveryCoordinates;

    const updated = await Donation.findByIdAndUpdate(id, updateData, { new: true });
    
    // Alert stakeholders about progress
    if (status === "Assigned") {
      sendAlert(`📍 Donation Claimed: An NGO has assigned a pickup for ${updated.foodAmount}kg.`);
    } else if (status === "Claimed & Collected") {
      sendAlert(`🚚 Food Collected: The donor has confirmed the pickup. Ready for distribution!`);
    } else if (status === "Delivered") {
      sendAlert(`✅ Distribution Complete: ${updated.foodAmount}kg successfully delivered!`);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating donation", error: err.message });
  }
};

// Archive (soft-hide) a delivered donation — data stays in DB
exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    await Donation.findByIdAndUpdate(id, { archived: true });
    res.json({ message: "Donation archived successfully. Data preserved in database." });
  } catch (err) {
    res.status(500).json({ message: "Error archiving donation", error: err.message });
  }
};