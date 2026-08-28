const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://zizoelsadany7_db_user:ZIZO1234@nti.hqjwjib.mongodb.net/MovieHub?retryWrites=true&w=majority';
    const opts = {
      serverSelectionTimeoutMS: 15000
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      console.log('✔ MongoDB Connected successfully');
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('✗ Database Connection Error:', e.message);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
