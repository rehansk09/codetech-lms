const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected.");
  } catch (error) {
    console.log("Error in connecting db:", error.message);
  }
};

module.exports = { dbConnect };
