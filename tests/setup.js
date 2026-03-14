// tests/setup.js
const mongoose = require("mongoose");

// Connect to a separate test database before all tests
beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/curelex_test");
});

// Clear all collections after each test to keep tests independent
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect after all tests finish
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});