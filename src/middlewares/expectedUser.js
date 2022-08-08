// Valida que el usuario que va a realizar la acción es el autenticado o

import { validateRole } from '../helper/utils.js'
import { RoleEnumType } from '../types/roleEnumType.js'

// La acción es realizada por alguien con permisos
export const expectedUserOrGestor = (req, res, next) => {
  try {
    const authorizedRoles = [
      RoleEnumType.GESTOR,
      RoleEnumType.ADMINISTRADOR,
      RoleEnumType.SUPERADMIN
    ]
    const { id, role: userRole } = req.user

    // Si el id del autenticado es
    // el mismo que se está enviando
    if (id === req.params.id ||
      validateRole({ userRole, authorizedRoles })) {
      next()
    } else {
      res.status(401).send({ msg: 'Insufficient Permission' }).end()
    }
  } catch (err) {
    next(err)
  }
}
