import { Router } from "express";
import upload from "../middlewares/multerMiddleware";
import { uploadImage } from "../controllers/imageController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router()

router.post('/upload',authMiddleware, upload.single('image'), uploadImage)

export default router