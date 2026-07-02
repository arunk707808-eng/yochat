import { TryCatch } from "../config/tryCatch.js";
import { publishingToQueue } from "../config/rabbitmq.js";
import { redisClient } from "../index.js";
import { User } from "../model/User.js";
import { genToken } from "../config/token.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";


export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body
  const ratelimitkey = `otp:ratelimit:${email}`
  const ratelimit = await redisClient.get(ratelimitkey)
  if (ratelimit) {
    return res.status(429).json({
      message: "to many request"
    })
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpkey = `otp:${email}`
  await redisClient.set(otpkey, otp, { EX: 300 })
  await redisClient.set(ratelimitkey, "true", { EX: 60 })
  const message = {
    to: email,
    subject: "Your otp code",
    body: `Your otp is ${otp}. it is valid upto 5 minuts`
  }
  await publishingToQueue("send-otp", message)
  res.status(200).json({
    message: "otp send successfull"
  })
})

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) {
    return res.status(400).json({
      message: "otp or email required!"
    })
  }
  const otpkey = `otp:${email}`
  const storedOtp = await redisClient.get(otpkey)
  console.log("storedOtp:", storedOtp)
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({
      message: "otp is not valid!"
    })
  }
  await redisClient.del(otpkey)
  let user = await User.findOne({ email })
  if (!user) {
    const name = email.slice(0, 8)
    user = await User.create({ name, email })
  }
  const token = genToken(user._id)

  res.status(200).json({
    message: "user verified",
    user,
    token
  })

})

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user
  res.json(user)
})

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
  let user = await User.findById(req.user?._id)
  if (!user) {
    return res.status(401).json({
      message: "please login"
    })
  }
  user.name = req.body.name;
  await user.save()
  const token = genToken(user._id)
  res.json({
    message: "name updated",
    token,
    user
  })
})
export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find()
  res.json(users)
})

export const getAUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
  res.json(user)
})