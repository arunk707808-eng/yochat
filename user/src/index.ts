import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js";
import { createClient } from "redis";
dotenv.config()

export const redisClient = createClient({
  url: process.env.REDIS_URL as string,
})
redisClient.connect().then(() => { console.log("redis connected") }).catch(console.error)
const app = express()
const port = process.env.PORT || 5000;



import userRoutes from "./routes/user.js"
import { connectRabbitMq } from "./config/rabbitmq.js";
app.use(express.json())
app.use(cors())
app.get("/", (req, res) => {
  return res.status(200).json({ message: "hello from server" })
})
app.use("/api/v1", userRoutes);

app.listen(port, async () => {
  await connectDB()
  await connectRabbitMq()
  console.log(`user service is running at port ${port}`)
})