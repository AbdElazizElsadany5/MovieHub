const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

const app = require('../Backend/app');
const connectDB = require('../Backend/config/connectDB');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless DB connection error:', err);
  }
  return app(req, res);
};
