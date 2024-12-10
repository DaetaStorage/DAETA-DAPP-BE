import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      ""
    );
    // await mongoose.connect("mongodb://127.0.0.1:27017/storx-db");

    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Internal Server Error During MongoDB Connection: ", error);
  }
};
