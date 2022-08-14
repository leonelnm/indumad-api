import { Router } from 'express'
import { createHandler, deleteHandler, findAllHandler, updateHandler } from '../controllers/guild.controller.js'
import { isGestor } from '../middlewares/validateRole.js'
import validateToken from '../middlewares/validateToken.js'

const guildRouter = Router()

guildRouter.get('/', validateToken, isGestor, findAllHandler)
guildRouter.put('/:name', validateToken, isGestor, updateHandler)
guildRouter.post('/', validateToken, isGestor, createHandler)
guildRouter.delete('/:name', validateToken, isGestor, deleteHandler)

export default guildRouter
