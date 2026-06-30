import type { Response } from "express";
import { TryCatch } from "../config/tryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { Chat } from "../model/chat.js";

export const createNewChat = TryCatch(async(req:AuthenticatedRequest, res:Response)=>{
  const userId = req.user?._id;
  const {otherUserId} = req.body;
  if(!otherUserId){
    return res.status(400).json({
      message:"otherUserId required"
    })
  }
  const existingChat = await Chat.findOne({
    users:{$all:[userId, otherUserId], $size:2}
  })
  if(existingChat){
    return res.json({
      message:"chat already exist",
      chatId: existingChat._id
    })
  }

  const newChat =  await Chat.create({
    users:[userId, otherUserId]
  })
  res.json({
    message:"new  chat created",
    chatId: newChat._id
  })
})

