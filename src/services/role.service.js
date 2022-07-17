import { Role } from '../models/role.model.js'

export const createRole = async (role) => {
  return await Role.create(role)
}

export const findAll = async () => {
  return await Role.findAll()
}

export const findOne = async (where = {}) => {
  const role = await Role.findOne({
    where,
    attributes: ['id', 'name']
  })
  return role
}

export const findRoles = async (roles = []) => {
  const rolesDB = []

  if (roles.length > 0) {
    let roleDB
    for (const role of roles) {
      roleDB = await findOne(role)
      if (roleDB) {
        rolesDB.push(roleDB)
      }
    }
  }

  return rolesDB
}
