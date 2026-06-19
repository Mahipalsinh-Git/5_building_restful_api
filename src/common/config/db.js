import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connections successfully");
    console.log("MongoDB connections: ", conn.connection.host);
  } catch (error) {
    console.log("Database connection error: ", error);
  }
};

export default connectDB;
