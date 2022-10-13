import { Router } from 'express'
import validateToken from '../middlewares/validateToken.js'
import { generateToken, login } from '../services/auth.service.js'

const authRouter = Router()

authRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(401).send({ msg: 'Invalid username or password' })
    }
    const user = await login({ username, password })
    if (user !== null) {
      return res.json(generateToken(user))
    }

    return res.status(401).send({ msg: 'Invalid username or password' })
  } catch (error) {
    next(error)
  }
})

authRouter.get('/validatetoken', validateToken, async (req, res, next) => {
  try {
    const user = req.user

    if (user !== null) {
      return res.json(generateToken(user))
    }

    return res.status(401).send({ msg: 'Invalid token or missing' })
  } catch (error) {
    next(error)
  }
})

export default authRouter
