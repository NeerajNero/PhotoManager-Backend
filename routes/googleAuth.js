import { Router } from "express";
import { googleAuth,googleAuthCallback,getUser } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router()

router.get('/google', googleAuth)
router.get('/google/callback', googleAuthCallback)
router.get('/user', authMiddleware, getUser)

export default router