import { Guild } from '../models/guild.model.js'

export const createGuild = async (name) => {
  return await Guild.create(name)
}

export const findAll = async (where = {}) => {
  return await Guild.findAll({
    where,
    order: [
      ['name', 'ASC']
    ]
  })
}

export const findGuild = async (where = {}) => {
  return await Guild.findOne({
    // attributes: ['id', 'name'],
    where
  })
}

export const deleteGuild = async (name) => {
  return await Guild.destroy({
    where: { name }
  })
}
