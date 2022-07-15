import { Router } from 'express'
import { createUserHandler, findAllHandler, findByIdHandler } from '../controllers/user.controller.js'

const userRouter = Router()

userRouter.post('/', createUserHandler)
userRouter.get('/', findAllHandler)
userRouter.get('/:id', findByIdHandler)

export default userRouter
