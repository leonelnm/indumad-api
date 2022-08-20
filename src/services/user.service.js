import { Guild } from '../models/guild.model.js'
import { Role } from '../models/role.model.js'
import { User } from '../models/user.model.js'
import { findRole } from './role.service.js'
import { findAll as findAllGuilds } from './guild.service.js'
import { ValidationError } from '../exceptions/ValidationError.js'

export const createUser = async ({ role, guilds = [], ...user }) => {
  // Valida ROLE
  const roleDB = await findRole(role)
  if (!roleDB) {
    throw new ValidationError(400, `Role ${role} not found`)
  }
  user.roleId = roleDB.id

  const userCreatedDB = await User.create(user, {
    include: [
      { model: Role, as: 'role' }
    ]
  })

  // valida Guilds
  if (guilds.length > 0) {
    const guildsDB = await findAllGuilds({ id: guilds })
    if (guilds.length !== guildsDB.length) {
      throw new ValidationError(400, `Invalid Guild, check guilds: [${guilds}]`)
    }

    await userCreatedDB.setGuilds(guildsDB)

    return await userCreatedDB.reload()
  }

  return { msg: 'userCreated' }
}

export const findAll = async (includeGuilds = false, guildStatus = undefined) => {
  const includes = [{ model: Role, as: 'role' }]

  if (includeGuilds) {
    includes.push(
      {
        model: Guild,
        as: 'guilds',
        through: {
          attributes: []
        },
        where: guildStatus !== undefined ? { status: guildStatus } : {}
      }
    )
  }

  return await User.findAll({ include: includes })
}

export const findUserById = async (id, includeGuilds = false, guildStatus = undefined) => {
  const includes = [{ model: Role, as: 'role' }]

  if (includeGuilds) {
    includes.push(
      {
        model: Guild,
        as: 'guilds',
        through: {
          attributes: []
        },
        where: guildStatus !== undefined ? { status: guildStatus } : {}
      }
    )
  }

  return await User.findByPk(id, {
    include: includes
  })
}

export const findUserWithRoles = async (where = {}) => {
  const user = await User.findOne({
    include: {
      model: Role,
      as: 'role',
      attributes: ['name']
    },
    where
  })

  return user
}

export const findUserForLogin = async (username) => {
  return await User.findOne({
    attributes: ['id', 'username', 'password', 'name'],
    include: {
      model: Role,
      as: 'role'
    },
    where: { username, active: true }
  })
}

export const findUser = async (options, includeRoles = false) => {
  if (includeRoles) {
    options.include = {
      model: Role,
      as: 'role',
      attributes: ['name']
    }
  }

  return await User.findOne(options)
}
