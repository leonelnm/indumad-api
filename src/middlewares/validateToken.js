import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export default (req, res, next) => {
  try {
    const authorization = req.get('Authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.substring(7)
      jwt.verify(token, config.jwt.secret)
    }
  } catch (err) {
    return res.status(400).send({ msg: 'Token invalid or missing' })
  }

  next()
}
