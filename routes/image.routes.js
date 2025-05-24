import { Router } from "express";
import upload from "../middlewares/multerMiddleware.js";
import { uploadImage, getImages, deleteImage, updateFavourite, addTags} from "../controllers/imageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router()

router.post('/upload',authMiddleware, upload.single('image'), uploadImage)
router.get('/images',authMiddleware, getImages)
router.delete('/image', authMiddleware, deleteImage)
router.put('/image/:imageId/favourite', authMiddleware, updateFavourite)
router.put('/image/:imageId', authMiddleware, addTags)

export default router