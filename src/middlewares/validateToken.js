import { verifyToken } from '../services/auth.service.js'

export default (req, res, next) => {
  try {
    const authorization = req.get('Authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.substring(7)
      const { user } = verifyToken(token)
      req.user = user
    } else {
      return res.status(401).send({ msg: 'Token invalid or missing' }).end()
    }
  } catch (err) {
    return res.status(401).send({ msg: 'Token invalid or missing' }).end()
  }
  next()
}
