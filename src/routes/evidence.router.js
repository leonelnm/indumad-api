import { Router } from 'express'
import { upload } from '../config/multer.js'
import { deleteHandler, findAllHandler, uploadHandler } from '../controllers/evidence.controller.js'
import { userAssignJobOrGestorJobParam } from '../middlewares/jobUserOrGestor.js'
import validateToken from '../middlewares/validateToken.js'

const evidenceRouter = Router()

// post and get use jobID
evidenceRouter.post('/upload/:id', validateToken, userAssignJobOrGestorJobParam, upload.single('evidence'), uploadHandler)
evidenceRouter.get('/:id', validateToken, userAssignJobOrGestorJobParam, findAllHandler)

// TODO allow delete if the employee is assigned to the job or is a gestor
evidenceRouter.delete('/:id', validateToken, deleteHandler)

export default evidenceRouter
