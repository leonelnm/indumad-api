import { Router } from 'express'
import { createHandler, deliveryNoteByJobIdHandler, findAllHandler, findJobHandler, updateJobHandler } from '../controllers/job.controller.js'
import { isGestor } from '../middlewares/validateRole.js'
import validateToken from '../middlewares/validateToken.js'

const jobRouter = Router()

jobRouter.get('/', validateToken, findAllHandler)
jobRouter.get('/:id', validateToken, findJobHandler)
jobRouter.put('/:id', validateToken, isGestor, updateJobHandler)
jobRouter.post('/', validateToken, isGestor, createHandler)
jobRouter.get('/deliverynote/:jobId', validateToken, deliveryNoteByJobIdHandler)

export default jobRouter
