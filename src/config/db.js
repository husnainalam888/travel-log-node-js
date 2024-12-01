const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGO_URI}`, {
      dbName: "travelLoger",
    });
    console.log("MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectDB;
