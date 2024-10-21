const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    if (conn.connection.host) {
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } else {
      console.log('MongoDB connected, but host information is not available.');
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;

