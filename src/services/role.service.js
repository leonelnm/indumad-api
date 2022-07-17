import { Role } from '../models/role.model.js'

export const createRole = async (role) => {
  return await Role.create(role)
}

export const findAll = async () => {
  return await Role.findAll()
}
