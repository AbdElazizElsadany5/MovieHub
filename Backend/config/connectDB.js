const mongoose = require('mongoose');
const chalk = require("chalk");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviehub');
    console.log(chalk.green(`✔ MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.red(`✗ Database Connection Error: ${error.message}`));
    throw error;
  }
};

module.exports = connectDB;
