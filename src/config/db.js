import mongoose from "mongoose";

const MONGO_URL = "mongodb://localhost:27017/products"; 

export const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error, failed MongoDB connection: ", error);
    process.exit(1);
  }
};
