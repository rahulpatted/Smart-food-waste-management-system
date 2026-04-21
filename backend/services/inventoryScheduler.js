const cron = require("node-cron");
const Inventory = require("../models/Inventory");
const Waste = require("../models/Waste");
const { sendAlert } = require("./notificationService");

/**
 * Automates daily inventory maintenance:
 * 1. Identifies and auto-expires items past their expiry date.
 * 2. Simulates daily consumption by reducing stock quantities by a random factor.
 * 3. Sends system alerts to admins for significant changes.
 */
const runDailyInventoryUpdate = async () => {
    console.log("⏱️ Starting Daily Inventory Update...");
    const now = new Date();
    
    try {
        // 1. Handle Expiry
        const expiredItems = await Inventory.find({ expiryDate: { $lt: now } });
        
        if (expiredItems.length > 0) {
            let totalExpiredWeight = 0;
            
            for (const item of expiredItems) {
                totalExpiredWeight += item.quantity;
                
                // Log as Waste
                await Waste.create({
                    type: `[AUTO-EXPIRED] ${item.item}`,
                    weight: item.quantity,
                    date: now,
                    coordinates: { lat: 12.9716, lng: 77.5946 } // Default campus coordinate
                });
                
                // Remove from active inventory
                await Inventory.findByIdAndDelete(item._id);
            }
            
            sendAlert(`🚨 Daily Cleanup: ${expiredItems.length} items expired and were moved to waste (${totalExpiredWeight.toFixed(1)}kg total).`, "admin");
            console.log(`✅ Formatted ${expiredItems.length} expired items into waste logs.`);
        }

        // 2. Simulate Daily Consumption (Usage)
        // Reduce quantity of all remaining items by 5-10%
        const activeItems = await Inventory.find();
        let depletedCount = 0;

        for (const item of activeItems) {
            // Random depletion between 5% and 12%
            const depletionFactor = 0.05 + (Math.random() * 0.07);
            const newQuantity = Math.max(0, item.quantity * (1 - depletionFactor));
            
            await Inventory.findByIdAndUpdate(item._id, { quantity: newQuantity.toFixed(2) });
            depletedCount++;
        }

        console.log(`✅ Successfully simulated daily consumption for ${depletedCount} inventory items.`);
        console.log("✅ Daily Inventory Update Complete.");

    } catch (error) {
        console.error("❌ Error during daily inventory update:", error);
    }
};

// Schedule to run at midnight every day (00:00)
// For hackathon visibility, we can also set it to a more frequent internal if needed, 
// but midnight is standard.
cron.schedule("0 0 * * *", () => {
    runDailyInventoryUpdate();
});

// Export for manual triggering in tests
module.exports = { runDailyInventoryUpdate };
