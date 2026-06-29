import express from "express";
import { getAllUser, getAUser, loginUser, myProfile, updateName, verifyUser } from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";


const router = express.Router()
router.post("/auth/login", loginUser)
router.post("/auth/verify", verifyUser)
router.get("/me", isAuth, myProfile)
router.get("/user/all", isAuth, getAllUser)
router.post("/user/update", isAuth, updateName)
router.get("/user/:id", getAUser)


export default router;