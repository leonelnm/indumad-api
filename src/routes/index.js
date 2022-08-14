import { Router } from 'express'
import authRouter from './auth.router.js'
import guildRouter from './guild.router.js'
import roleRouter from './role.router.js'
import userRouter from './user.router.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/role', roleRouter)
router.use('/user', userRouter)
router.use('/guild', guildRouter)

export default router
