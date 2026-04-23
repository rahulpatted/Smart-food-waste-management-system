/**
 * Jest Setup File
 * Runs before all tests to configure the test environment
 */

// Set test environment
process.env.NODE_ENV = "test";
process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/foodsave-test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_key";

// Suppress console logs during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };

module.exports = {};
