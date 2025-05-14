import { Router } from "express";
import upload from "../middlewares/multerMiddleware.js";
import { uploadImage } from "../controllers/imageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router()

router.post('/upload',authMiddleware, upload.single('image'), uploadImage)

export default router