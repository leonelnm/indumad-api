// Valida que el usuario que va a realizar la acción es el autenticado o

import { authorizedRoles, validateRole } from '../helper/utils.js'
import { validateIdField } from '../validations/fieldValidator.js'

// La acción es realizada por alguien con permisos
export const expectedUserOrGestor = (req, res, next) => {
  try {
    const { id, role: userRole } = req.user

    // validate id
    const { error } = validateIdField(req.params.id)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    // Si el id del autenticado es
    // el mismo que se está enviando
    if (id === req.params.id * 1 ||
      validateRole({ userRole, authorizedRoles: authorizedRoles.gestor })) {
      next()
    } else {
      res.status(401).send({ msg: 'Insufficient Permission' }).end()
    }
  } catch (err) {
    next(err)
  }
}
