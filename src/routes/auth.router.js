import { Router } from 'express'
import { generateToken, login } from '../services/auth.service.js'

const authRouter = Router()

authRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await login({ username, password })

    if (user !== null) {
      return res.json(generateToken(user))
    }

    return res.status(401).send({ msg: 'Invalid username or password' })
  } catch (error) {
    next(error)
  }
})

export default authRouter
