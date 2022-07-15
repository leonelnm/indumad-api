import { Router } from 'express'
import authRouter from './auth.router.js'
import userRouter from './user.router.js'

const router = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)

export default router
