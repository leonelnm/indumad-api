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

export const findRole = async (role) => {
  return await findOne({ name: role })
}
