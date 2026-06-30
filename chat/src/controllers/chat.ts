import type { Response } from "express";
import { TryCatch } from "../config/tryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { Chat } from "../model/chat.js";
import { Message } from "../model/message.js";
import axios from "axios";

export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  const { otherUserId } = req.body;
  if (!otherUserId) {
    return res.status(400).json({
      message: "otherUserId required"
    })
  }
  const existingChat = await Chat.findOne({
    users: { $all: [userId, otherUserId], $size: 2 }
  })
  if (existingChat) {
    return res.json({
      message: "chat already exist",
      chatId: existingChat._id
    })
  }

  const newChat = await Chat.create({
    users: [userId, otherUserId]
  })
  res.json({
    message: "new  chat created",
    chatId: newChat._id
  })
})

export const getAllChat = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id
  if (!userId) {
    return res.json({
      message: "userId is missing"
    })
  }
  const chats = await Chat.find({ user: userId }).sort({ updatedAt: -1 })
  const chatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find((id) => id !== userId)
      const countUnseenMessages = await Message.countDocuments({
        chatId: chat._id,
        sender: { $ne: userId },
        seen: false
      })
      try {
        const { data } = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`)
        return {
          user: data,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            countUnseenMessages
          }
        }
      } catch (error) {
        console.log(error)
        return {
          user: { _id: otherUserId, name: "unknown user" },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            countUnseenMessages
          }
        }
      }
    })
  )

  res.json({
    chats: chatWithUserData
  })
})


export const sendMessage = TryCatch(async(req:AuthenticatedRequest, res:Response)=>{
  const senderId = req.user?._id
  const {chatId, text} = req.body
  const imageFile = req.file
  if(!senderId){
    return res.status(401).json({
      message:"unauthorized"
    })
  }
  if(!chatId){
    return res.status(400).json({
      message:"chatId is required"
    })
  }
  if(!text && !imageFile){
    return res.status(400).json({
      message:"text or image required"
    })
  }

  const chat =  await Chat.findById(chatId)
  if(!chat){
    return res.status(404).json({
      message:"chat not found"
    })
  }
  const isUserInChat = chat.users.some(
    (userId)=> userId.toString() === senderId.toString()
  )
   if(!isUserInChat){
    return res.status(403).json({
      message:"you are not participent of this chat"
    })
  }

  const otherUserId = chat.users.find(
    (userId)=> userId.toString() === senderId.toString()
  )
  if(!otherUserId){
    return res.status(403).json({
      message:"no other user"
    })
  }
  //socket setup
  
})
