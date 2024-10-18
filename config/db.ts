import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://lightningdev722:sjW86eKb4TttfzQr@cluster0.rq0edjh.mongodb.net/storageX"
    );

    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Internal Server Error During MongoDB Connection: ", error);
  }
};
