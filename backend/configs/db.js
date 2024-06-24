const mongoose = require("mongoose");

const Connectdb = async () => {
  try {
    const conn = await mongoose.connect( process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = Connectdb;
