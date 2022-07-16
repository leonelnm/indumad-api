import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export const generateToken = ({ username }) => {
  const { secret, tokenExpirationMinutes: expiresIn } = config.jwt

  const payload = {
    data: {
      username
    }
  }

  return { token: jwt.sign(payload, secret, { expiresIn: expiresIn * 60 }) }
}
