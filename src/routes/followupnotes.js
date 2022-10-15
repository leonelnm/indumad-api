import { Router } from 'express'
import { addFollowupNoteToJobHandler, findAllByJobHandler, markAsReadFollowUpNoteHandler } from '../controllers/followupnotes.controller.js'
import validateToken from '../middlewares/validateToken.js'

const followUpNotesRouter = Router()

followUpNotesRouter.get('/:jobId', validateToken, findAllByJobHandler)
followUpNotesRouter.post('/:jobId', validateToken, addFollowupNoteToJobHandler)
followUpNotesRouter.put('/markasread/:id', validateToken, markAsReadFollowUpNoteHandler)

export default followUpNotesRouter
