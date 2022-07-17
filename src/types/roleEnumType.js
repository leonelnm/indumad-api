export const RoleEnumType = {
  AUTONOMO: 'AUTONOMO',
  CONTRATADO: 'CONTRATADO',
  GESTOR: 'GESTOR',
  ADMINISTRADOR: 'ADMINISTRADOR',
  SUPERADMIN: 'SUPERADMIN' // exclusivo para funciones especiales (sabe lo q hace)
}

export const Environtment = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test'
}

export const toArrayStringFromObjectType = (type = {}) => {
  return Object.values(type)
}
