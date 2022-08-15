import { Guild } from '../models/guild.model.js'

export const createGuild = async (name) => {
  return await Guild.create(name)
}

export const findAll = async (where = {}) => {
  return await Guild.findAll({
    where
  })
}

export const findGuild = async (name) => {
  return await Guild.findOne({
    // attributes: ['id', 'name'],
    where: { name }
  })
}

export const deleteGuild = async (name) => {
  return await Guild.destroy({
    where: { name }
  })
}