import { Router } from 'express'
import config from '../config/config.js'
import validateToken from '../middlewares/validateToken.js'
import { generateJWT, generatePayload, generateToken, login, verifyToken } from '../services/auth.service.js'
import { Environtment } from '../types/roleEnumType.js'

const authRouter = Router()

authRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(401).send({ msg: 'Invalid username or password' })
    }
    const user = await login({ username, password })

    console.log(`secure: ${config.env === Environtment.PRODUCTION}`)

    if (user !== null) {
      res.cookie(config.cookieAuthName, generateJWT(user), {
        sameSite: 'none',
        secure: config.env === Environtment.PRODUCTION,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 10 // 10h
      })
      return res.json(generatePayload(user))
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

authRouter.get('/validatecookie', async (req, res, next) => {
  try {
    const token = req.cookies[config.cookieAuthName]

    if (token) {
      try {
        const { user } = verifyToken(token)
        console.log(user)
        return res.status(200).send()
      } catch (error) {
        return res.status(401).send({ msg: 'Invalid cookie auth or missing' })
      }
    }

    return res.status(401).send({ msg: 'Invalid cookie auth or missing' })
  } catch (error) {
    next(error)
  }
})

export default authRouter
