require("dotenv").config();
const sequelize = require("../config/mysql");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// ✅ ADD THIS
afterEach(async () => {
  const tables = sequelize.models;
  for (const modelName in tables) {
    await tables[modelName].destroy({ where: {}, truncate: true });
  }
});

afterAll(async () => {
  await sequelize.close();
});