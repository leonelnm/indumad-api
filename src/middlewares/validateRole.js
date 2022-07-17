import { RoleEnumType } from '../types/roleEnumType.js'

// Validará el rol mínimo con el que se puede acceder a la ruta

const validateRole = ({ userRoles = [], authorizedRoles = [] }) => {
  let authorized = false
  for (const role of authorizedRoles) {
    if (userRoles.includes(role)) {
      authorized = true
      break
    }
  }
  return authorized
}

export const isSuperAdmin = (req, res, next) => {
  const authorizedRoles = [RoleEnumType.SUPERADMIN]

  const { roles: userRoles } = req.user
  if (validateRole({ userRoles, authorizedRoles })) {
    next()
  } else {
    return res.status(401).send({ msg: 'No tiene suficientes permisos' })
  }
}

export const isAdministrador = (req, res, next) => {
  const authorizedRoles = [
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ]

  const { roles: userRoles } = req.user
  if (validateRole({ userRoles, authorizedRoles })) {
    next()
  } else {
    return res.status(401).send({ msg: 'No tiene suficientes permisos' })
  }
}

export const isGestor = (req, res, next) => {
  const authorizedRoles = [
    RoleEnumType.GESTOR,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ]

  const { roles: userRoles } = req.user
  if (validateRole({ userRoles, authorizedRoles })) {
    next()
  } else {
    return res.status(401).send({ msg: 'No tiene suficientes permisos' })
  }
}

export const isAutonomo = (req, res, next) => {
  const authorizedRoles = [
    RoleEnumType.AUTONOMO,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ]

  const { roles: userRoles } = req.user
  if (validateRole({ userRoles, authorizedRoles })) {
    next()
  } else {
    return res.status(401).send({ msg: 'No tiene suficientes permisos' })
  }
}

export const isContratado = (req, res, next) => {
  const authorizedRoles = [
    RoleEnumType.CONTRATADO,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ]

  const { roles: userRoles } = req.user
  if (validateRole({ userRoles, authorizedRoles })) {
    next()
  } else {
    return res.status(401).send({ msg: 'No tiene suficientes permisos' })
  }
}
