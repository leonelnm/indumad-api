import { Router } from 'express'
import { createHandler, findAllHandler, findJobHandler } from '../controllers/job.controller.js'
import validateToken from '../middlewares/validateToken.js'

const jobRouter = Router()

jobRouter.get('/', validateToken, findAllHandler)
jobRouter.get('/:id', validateToken, findJobHandler)
jobRouter.post('/', createHandler)

export default jobRouter
