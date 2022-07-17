import { Router } from 'express'
import { createHandler, findAllHandler } from '../controllers/role.controller..js'

const roleRouter = Router()

roleRouter.get('/', findAllHandler)
roleRouter.post('/', createHandler)

export default roleRouter
