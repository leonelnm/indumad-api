import { verifyToken } from '../services/auth.service.js'

export default (req, res, next) => {
  try {
    // include on header as Authorization
    const authorization = req.get('Authorization')

    if (!authorization) {
      return res.status(400).send({ msg: 'Authorization header missing' }).end()
    }

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
