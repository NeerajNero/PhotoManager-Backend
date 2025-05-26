import {Router} from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { createAlbum, updateDescription, deleteAlbum, shareWithOthers,getAlbums } from '../controllers/albumController.js'

const router = Router()

router.post('/album', authMiddleware, createAlbum)
router.delete('/album/:albumId', authMiddleware, deleteAlbum)
router.put('/album/:albumId', authMiddleware, updateDescription)
router.patch('/album/:albumId/share', authMiddleware, shareWithOthers)
router.get('/albums', authMiddleware, getAlbums)

export default router