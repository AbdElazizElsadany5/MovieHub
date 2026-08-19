const mongoose = require('mongoose');
const chalk = require("chalk")
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moviehub');
    console.log(chalk.green(`✔ MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.red(`✗ Database Connection Error: ${error.message}`));
    process.exit(1);
  }
};
module.exports = connectDB;
