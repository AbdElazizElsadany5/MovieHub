const path = require('path');
const app = require(path.join(process.cwd(), 'Backend/app'));
const connectDB = require(path.join(process.cwd(), 'Backend/config/connectDB'));

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless DB connection error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error: ' + (err ? err.message : 'Unknown error')
    });
  }
  return app(req, res);
};
