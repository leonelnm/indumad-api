import { Router } from 'express'
import { createHandler, deleteHandler, findAllHandler, findByJobHandler } from '../controllers/schedule.controller.js'
import { userAssignJobOrGestorJobBody, userAssignJobOrGestorJobParam } from '../middlewares/jobUserOrGestor.js'
import { isGestor } from '../middlewares/validateRole.js'
import validateToken from '../middlewares/validateToken.js'

const scheduleRouter = Router()

scheduleRouter.post('/', validateToken, userAssignJobOrGestorJobBody, createHandler)
scheduleRouter.get('/', validateToken, findAllHandler)

// TODO pending implementation
scheduleRouter.get('/:id', validateToken, userAssignJobOrGestorJobParam, findByJobHandler)
scheduleRouter.delete('/:id', validateToken, isGestor, deleteHandler)

export default scheduleRouter
