import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://lightningdev722:sjW86eKb4TttfzQr@cluster0.rq0edjh.mongodb.net/storageX"
    );
    // await mongoose.connect("mongodb://127.0.0.1:27017/storx-db");

    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Internal Server Error During MongoDB Connection: ", error);
  }
};
