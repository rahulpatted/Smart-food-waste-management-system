require("dotenv").config();
const mongoose = require("mongoose");
const { runDailyInventoryUpdate } = require("../services/inventoryScheduler");

const testScheduler = async () => {
    try {
        console.log("🚀 Testing Inventory Scheduler...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected.");

        // Manually trigger the update
        await runDailyInventoryUpdate();

        console.log("✅ Test Execution Finished.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Test Failed:", err);
        process.exit(1);
    }
};

testScheduler();
