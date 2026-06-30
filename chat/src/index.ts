import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chat.js"
dotenv.config()
connectDB();
const app = express()
const port = process.env.PORT || 5002;


app.use(express.json())
app.get("/", (req, res) => {
  return res.status(200).json({ message: "hello from chat server" })
})
app.use("/api/v1",chatRoutes);


app.listen(port, async () => {

  console.log(`chat service is running at port ${port}`)
})