import { Router } from 'express'
import { createUserHandler, findAllHandler, findByIdHandler } from '../controllers/user.controller.js'
import validateToken from '../middlewares/validateToken.js'

const userRouter = Router()

userRouter.get('/:id', findByIdHandler)
userRouter.get('/', validateToken, findAllHandler)
userRouter.post('/', createUserHandler)

export default userRouter
