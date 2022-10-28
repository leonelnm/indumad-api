import { Router } from 'express'
import authRouter from './auth.router.js'
import evidenceRouter from './evidence.router.js'
import followUpNotesRouter from './followupnotes.js'
import guildRouter from './guild.router.js'
import jobRouter from './job.router.js'
import referenceRouter from './reference.router.js'
import roleRouter from './role.router.js'
import userRouter from './user.router.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/role', roleRouter)
router.use('/user', userRouter)
router.use('/guild', guildRouter)
router.use('/reference', referenceRouter)
router.use('/job', jobRouter)
router.use('/followupnotes', followUpNotesRouter)
router.use('/evidence', evidenceRouter)

export default router
