import {Router} from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { createAlbum, updateDescription, deleteAlbum, shareWithOthers } from '../controllers/albumController.js'

const router = Router()

router.post('/album', authMiddleware, createAlbum)
router.delete('/album/:albumId', authMiddleware, deleteAlbum)
router.put('/album/:albumId', authMiddleware, updateDescription)
router.put('/album/:albumId/share', authMiddleware, shareWithOthers)

export default router