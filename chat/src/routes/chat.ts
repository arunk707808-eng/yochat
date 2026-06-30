import express from "express"
import { createNewChat, getAllChat } from "../controllers/chat.js"
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router()

router.post("/chat/new", isAuth, createNewChat)
router.get("/chat/all", isAuth, getAllChat)


export default router;