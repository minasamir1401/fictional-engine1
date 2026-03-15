const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

let sequelize;

if (dbUrl) {
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  console.error("❌ CRITICAL: DATABASE_URL is not defined! Please set it in your environment variables.");
  // Dummy class to prevent crashes during module loading
  class DummyModel {}
  sequelize = {
    authenticate: () => Promise.reject(new Error("Database not configured")),
    sync: () => Promise.resolve(),
    define: () => {
      const Model = class extends DummyModel {};
      Model.prototype = {};
      return Model;
    },
    models: {}
  };
}

module.exports = sequelize;
