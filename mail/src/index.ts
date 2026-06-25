import express from "express";
import dotenv from "dotenv"
dotenv.config()
const app = express()
const port = process.env.PORT || 5001;


app.use(express.json())
app.get("/", (req, res) => {
  return res.status(200).json({ message: "hello from server" })
})


app.listen(port, async () => {

  console.log(`user service is running at port ${port}`)
})