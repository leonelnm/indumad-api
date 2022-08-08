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
