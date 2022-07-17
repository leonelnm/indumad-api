import { validateRole } from '../helper/utils.js'
import { RoleEnumType } from '../types/roleEnumType.js'

export const isSuperAdmin = (req, res, next) => {
  const authorizedRoles = [RoleEnumType.SUPERADMIN]

  try {
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isAdministrador = (req, res, next) => {
  const authorizedRoles = [
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ]

  try {
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isGestor = (req, res, next) => {
  const authorizedRoles = [
    RoleEnumType.GESTOR,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ]

  try {
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isAutonomo = (req, res, next) => {
  const authorizedRoles = [
    RoleEnumType.AUTONOMO,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ]

  try {
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const isContratado = (req, res, next) => {
  const authorizedRoles = [
    RoleEnumType.CONTRATADO,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ]

  try {
    const { roles: userRoles } = req.user
    if (validateRole({ userRoles, authorizedRoles })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}
