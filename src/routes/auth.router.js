import { Router } from 'express'
import { generateToken } from '../services/jwt.service.js'
import { login } from '../services/user.service.js'

const authRouter = Router()

authRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await login({ username, password })

    if (user !== null) {
      return res.json(generateToken(user))
    }

    return res.status(400).send({ msg: 'Invalid username or password' })
  } catch (error) {
    next(error)
  }
})

export default authRouter
