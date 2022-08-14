import { createRole, findRole } from '../services/role.service.js'
import { RoleEnumType } from '../types/roleEnumType.js'
import { validateRoleSchema } from '../validations/roleSchemaValidator.js'

export const findAllHandler = async (_req, res) => {
  const roles = Object.values(RoleEnumType).sort()

  const data = {
    length: roles.length,
    roles
  }

  return res.json(data).end()
}

export const createHandler = async (req, res, next) => {
  const { name: nameFromRequest } = req.body

  try {
    const { error, name } = validateRoleSchema({ name: nameFromRequest })
    if (error) {
      return res.status(400).json({ msg: error }).end()
    } else {
      await createRole({ name })
      return res.status(201).json({ msg: `Role ${name} creado` }).end()
    }
  } catch (error) {
    next(error)
  }
}

export const findRolesHandler = async (req, res) => {
  const { role } = req.body

  const data = await findRole(role)

  return res.json(data).end()
}
