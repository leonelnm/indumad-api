import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { findUserForLogin } from './user.service.js'

export const generateToken = ({ id, username, roles }) => {
  const { secret, tokenExpirationMinutes: expiresIn } = config.jwt

  const payload = {
    data: {
      id,
      username,
      roles
    }
  }

  return { token: jwt.sign(payload, secret, { expiresIn: expiresIn * 60 }) }
}

export const login = async ({ username, password }) => {
  const user = await findUserForLogin(username)

  if (validatePassword({ password, user })) {
    return {
      id: user.id,
      username: user.username,
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
