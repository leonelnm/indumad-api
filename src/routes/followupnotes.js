import { Router } from 'express'
import { addBudgetToJobHandler, addFollowupNoteToJobHandler, approveBudgetByJobHandler, findAllByJobHandler, markAsReadFollowUpNoteHandler } from '../controllers/followupnotes.controller.js'
import { userAssignJobOrGestorJobParam } from '../middlewares/jobUserOrGestor.js'
import { isGestor } from '../middlewares/validateRole.js'
import validateToken from '../middlewares/validateToken.js'

const followUpNotesRouter = Router()

followUpNotesRouter.get('/:id', validateToken, userAssignJobOrGestorJobParam, findAllByJobHandler)
followUpNotesRouter.post('/:id', validateToken, userAssignJobOrGestorJobParam, addFollowupNoteToJobHandler)
// TODO allow mark as read only user assign or gestor
followUpNotesRouter.put('/markasread/:id', validateToken, markAsReadFollowUpNoteHandler)
followUpNotesRouter.post('/budget/:id', validateToken, userAssignJobOrGestorJobParam, addBudgetToJobHandler)
followUpNotesRouter.post('/budget/approve/:id', validateToken, isGestor, approveBudgetByJobHandler)

export default followUpNotesRouter
