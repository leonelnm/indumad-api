import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export default (req, res, next) => {
  try {
    const authorization = req.get('Authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.substring(7)
      const { data } = jwt.verify(token, config.jwt.secret)
      req.user = data
    } else {
      return res.status(401).send({ msg: 'Token invalid or missing' }).end()
    }
  } catch (err) {
    return res.status(401).send({ msg: 'Token invalid or missing' }).end()
  }
  next()
}
