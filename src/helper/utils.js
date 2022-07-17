export const getMsgErrorJoiValidation = error => error ? error.message : undefined

// Validará el rol mínimo con el que se puede acceder a la ruta
export const validateRole = ({ userRoles = [], authorizedRoles = [] }) => {
  let authorized = false
  for (const role of authorizedRoles) {
    if (userRoles.includes(role)) {
      authorized = true
      break
    }
  }
  return authorized
}
