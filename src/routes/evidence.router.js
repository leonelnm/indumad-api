import { Router } from 'express'
import { upload } from '../config/multer.js'
import { deleteHandler, findAllHandler, uploadHandler } from '../controllers/evidence.controller.js'
import validateToken from '../middlewares/validateToken.js'

const evidenceRouter = Router()

// TODO validar user tiene asignado job o es gestor
evidenceRouter.post('/upload/:jobId', validateToken, upload.single('evidence'), uploadHandler)
evidenceRouter.get('/:jobId', validateToken, findAllHandler)
evidenceRouter.delete('/:id', validateToken, deleteHandler)

export default evidenceRouter
