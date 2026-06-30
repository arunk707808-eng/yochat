import express from "express"
import { createNewChat, getAllChat, sendMessage } from "../controllers/chat.js"
import { isAuth } from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router()

router.post("/chat/new", isAuth, createNewChat)
router.get("/chat/all", isAuth, getAllChat)
router.post("/chat/upload", isAuth, upload.single("image"), sendMessage)


export default router;