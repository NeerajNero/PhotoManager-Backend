import {Router} from 'express'
import { addComment } from '../controllers/commentController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.post('/comment/:imageId', authMiddleware, addComment)

export default router