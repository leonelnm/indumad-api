import { authorizedRoles, validateRole } from '../helper/utils.js'

export const isSuperAdmin = (req, res, next) => {
  try {
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles: authorizedRoles.superAdmin })) {
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
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles: authorizedRoles.administrador })) {
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
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles: authorizedRoles.gestor })) {
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
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles: authorizedRoles.gestor })) {
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
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles: authorizedRoles.contratado })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}
