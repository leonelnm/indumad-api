import { Router } from 'express'
import { addFollowupNoteToJobHandler, findAllByJobHandler, markAsReadFollowUpNoteHandler } from '../controllers/followupnotes.controller.js'
import { userAssignJobOrGestorJobParam } from '../middlewares/jobUserOrGestor.js'
import validateToken from '../middlewares/validateToken.js'

const followUpNotesRouter = Router()

followUpNotesRouter.get('/:id', validateToken, userAssignJobOrGestorJobParam, findAllByJobHandler)
followUpNotesRouter.post('/:id', validateToken, userAssignJobOrGestorJobParam, addFollowupNoteToJobHandler)
// TODO allow mark as read only user assign or gestor
followUpNotesRouter.put('/markasread/:id', validateToken, markAsReadFollowUpNoteHandler)

export default followUpNotesRouter
