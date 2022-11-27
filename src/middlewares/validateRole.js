import * as utils from '../helper/utils.js'

export const isSuperAdmin = (req, res, next) => {
  try {
    const { role } = req.user
    if (utils.isSuperAdmin({ role })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isAdministrador = (req, res, next) => {
  try {
    const { role } = req.user
    if (utils.isAdministrador({ role })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isGestor = (req, res, next) => {
  try {
    const { role } = req.user
    if (utils.isGestor({ role })) {
      req.user.isGestor = true
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isAutonomo = (req, res, next) => {
  try {
    const { role } = req.user
    if (utils.isAutonomo({ role })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isContratado = (req, res, next) => {
  try {
    const { role } = req.user
    if (utils.isContratado({ role })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isGestorOrAutonomo = (req, res, next) => {
  try {
    const { role } = req.user
    if (utils.isGestor({ role }) || utils.isAutonomo({ role })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}
