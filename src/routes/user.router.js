import { Router } from 'express'
import { createUserHandler, toggleActiveUserHandler, findAllHandler, findByIdHandler, updateUserHandler, updatePasswordHandler, findAllByGuildIdHandler } from '../controllers/user.controller.js'
import { expectedUserOrGestor } from '../middlewares/expectedUser.js'
import { isGestor } from '../middlewares/validateRole.js'
import validateToken from '../middlewares/validateToken.js'

const userRouter = Router()

userRouter.get('/:id', validateToken, expectedUserOrGestor, findByIdHandler)
userRouter.get('/', validateToken, isGestor, findAllHandler)
userRouter.get('/guild/:guildId', validateToken, isGestor, findAllByGuildIdHandler)
userRouter.post('/', validateToken, isGestor, createUserHandler)
userRouter.put('/:id', validateToken, expectedUserOrGestor, updateUserHandler)
userRouter.put('/:id/active', validateToken, isGestor, toggleActiveUserHandler)
userRouter.put('/:id/password', validateToken, expectedUserOrGestor, updatePasswordHandler)

export default userRouter
