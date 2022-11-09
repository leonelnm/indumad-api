import { Router } from 'express'
import { createHandler, findAllHandler } from '../controllers/role.controller.js'
import { isSuperAdmin } from '../middlewares/validateRole.js'
import validateToken from '../middlewares/validateToken.js'

const roleRouter = Router()

roleRouter.get('/', findAllHandler)
roleRouter.post('/', validateToken, isSuperAdmin, createHandler)

export default roleRouter
