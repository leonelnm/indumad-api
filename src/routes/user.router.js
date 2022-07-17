import { Router } from 'express'
import { createUserHandler, findAllHandler, findByIdHandler } from '../controllers/user.controller.js'
import { isGestor } from '../middlewares/validateRole.js'
import validateToken from '../middlewares/validateToken.js'

const userRouter = Router()

userRouter.get('/:id', findByIdHandler)
userRouter.get('/', validateToken, findAllHandler)
userRouter.post('/', validateToken, isGestor, createUserHandler)

export default userRouter
