import { Router } from 'express'
import { createHandler, deleteHandler, findAllHandler, updateHandler } from '../controllers/reference.controller.js'
import { isGestor } from '../middlewares/validateRole.js'
import validateToken from '../middlewares/validateToken.js'

const referenceRouter = Router()

referenceRouter.get('/', validateToken, isGestor, findAllHandler)
referenceRouter.put('/:name', validateToken, isGestor, updateHandler)
referenceRouter.post('/', validateToken, isGestor, createHandler)
referenceRouter.delete('/:name', validateToken, isGestor, deleteHandler)

export default referenceRouter
