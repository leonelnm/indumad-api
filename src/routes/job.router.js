import { Router } from 'express'
import { createHandler, findAllHandler } from '../controllers/job.controller.js'
import validateToken from '../middlewares/validateToken.js'

const jobRouter = Router()

jobRouter.get('/', validateToken, findAllHandler)
jobRouter.post('/', createHandler)

export default jobRouter
