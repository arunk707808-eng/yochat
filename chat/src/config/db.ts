import mongoose from "mongoose";

export const connectDB = async () => {
  const url = process.env.MONGO_URI
  if (!url) {
    throw new Error("db url not found !")
  }
  try {
    await mongoose.connect(url, {
      dbName: "chatapp"
    })
    console.log("DB connected")
  } catch (error) {
    if(error instanceof Error){
      console.log("mongodb Error:", error.message)
    }else{
      console.log("unknown Error:", error)
    }
    process.exit(1)
  }
}