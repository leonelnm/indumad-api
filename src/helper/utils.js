import { RoleEnumType } from '../types/roleEnumType.js'

export const getMsgErrorJoiValidation = error => error ? error.message : undefined

// Validará el rol mínimo con el que se puede acceder a la ruta
export const validateRole = ({ userRole = '', authorizedRoles = [] }) => {
  return authorizedRoles.includes(userRole)
}

export const authorizedRoles = {
  administrador: [
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ],
  autonomo: [
    RoleEnumType.AUTONOMO,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ],
  contratado: [
    RoleEnumType.CONTRATADO,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ],
  gestor: [
    RoleEnumType.GESTOR,
    RoleEnumType.ADMINISTRADOR,
    RoleEnumType.SUPERADMIN
  ],
  superAdmin: [RoleEnumType.SUPERADMIN]
}

export const isSuperAdmin = ({ role = '' }) => {
  return validateRole({
    userRole: role,
    authorizedRoles: authorizedRoles.superAdmin
  })
}

export const isAdministrador = ({ role = '' }) => {
  return validateRole({
    userRole: role,
    authorizedRoles: authorizedRoles.administrador
  })
}

export const isGestor = ({ role = '' }) => {
  return validateRole({
    userRole: role,
    authorizedRoles: authorizedRoles.gestor
  })
}

export const isAutonomo = ({ role = '' }) => {
  return validateRole({
    userRole: role,
    authorizedRoles: authorizedRoles.autonomo
  })
}

export const isContratado = ({ role = '' }) => {
  return validateRole({
    userRole: role,
    authorizedRoles: authorizedRoles.contratado
  })
}

export const removeNullValuesFromObject = (obj) => {
  const copy = { ...obj }
  Object.keys(copy).forEach((k) => copy[k] === null && delete copy[k])
  return copy
}

export const removeEmptyValuesFromObject = (obj) => {
  const copy = { ...obj }
  Object.keys(copy).forEach((k) => {
    if (typeof copy[k] === 'string') {
      copy[k] = copy[k].trim()
    }
    if (typeof copy[k] === 'object') {
      copy[k] = removeEmptyValuesFromObject(copy[k])
    }
    (copy[k] === null || copy[k] === '') && delete copy[k]
  })
  return copy
}
