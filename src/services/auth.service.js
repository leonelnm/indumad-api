import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { findUserForLogin } from './user.service.js'

const { secret, tokenExpirationMinutes: expiresIn } = config.jwt

export const generateToken = ({ id, username, name, roles }) => {
  const payload = {
    user: {
      id,
      name,
      username,
      roles
    }
  }

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
      roles: user.roles.map(r => r.name)
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
