import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { findUserForLogin } from './user.service.js'

const { secret, tokenExpirationMinutes: expiresIn } = config.jwt

export const generatePayload = ({ id, username, name, role }) => {
  return {
    user: {
      id,
      name,
      username,
      role
    }
  }
}

export const generateJWT = (user) => {
  return jwt.sign(generatePayload(user), secret, { expiresIn: expiresIn * 60 })
}

export const generateToken = (user) => {
  const payload = generatePayload(user)
  return {
    token: jwt.sign(payload, secret, { expiresIn: expiresIn * 60 }),
    user: payload.user
  }
}

export const verifyToken = (token) => {
  return jwt.verify(token, secret, (err, payload) => {
    if (err) {
      throw new Error('Token invalid')
    }
    return { user: payload.user }
  })
}

export const login = async ({ username, password }) => {
  const user = await findUserForLogin(username)

  if (validatePassword({ password, user })) {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role?.name
    }
  }

  return null
}

export const validatePassword = ({ password, user = {} }) => {
  return user && bcrypt.compareSync(password, user.password)
}

export const encryptPassword = ({ password }) => {
  return bcrypt.hashSync(password, config.saltRound)
}
