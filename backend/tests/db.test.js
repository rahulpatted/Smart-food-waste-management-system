const mongoose = require("mongoose");
require("dotenv").config();

describe("Database Connection", () => {
  beforeAll(async () => {
    // Ensure we are connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    // We don't close the connection here to avoid affecting other tests if they share it,
    // but in a real isolated test environment, we would.
    // For this hackathon setup, we'll just check the state.
  });

  test("should connect to MongoDB successfully", () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });
});
