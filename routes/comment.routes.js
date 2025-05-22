import {Router} from 'express'
import { addComment } from '../controllers/commentController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/comment/:imageId', authMiddleware, addComment)

export default router