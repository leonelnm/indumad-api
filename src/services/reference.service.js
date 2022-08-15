import { Reference } from '../models/reference.model.js'

export const createReference = async (name) => {
  return await Reference.create(name)
}

export const findAll = async (where = {}) => {
  return await Reference.findAll({
    where,
    order: [
      ['name', 'ASC']
    ]
  })
}

export const findReference = async (name) => {
  return await Reference.findOne({
    // attributes: ['id', 'name'],
    where: { name }
  })
}

export const deleteReference = async (name) => {
  return await Reference.destroy({
    where: { name }
  })
}
