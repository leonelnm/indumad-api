import { Op } from 'sequelize'
import { Guild } from '../models/guild.model.js'
import { Role } from '../models/role.model.js'
import { User } from '../models/user.model.js'
import { findRole } from './role.service.js'
import { findAll as findAllGuilds, findGuild } from './guild.service.js'
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

  return userCreatedDB
}

export const findAll = async ({ userQuery = {}, guildQuery = {} }) => {
  const includes = [{ model: Role, as: 'role' }]

  if (guildQuery.include) {
    includes.push(
      {
        model: Guild,
        as: 'guilds',
        through: {
          attributes: []
        },
        where: guildQuery.status !== undefined ? { status: guildQuery.status } : {}
      }
    )
  }

  const order = []
  if (userQuery.order) {
    order.push(['username', userQuery.order])
  }

  return await User.findAll({
    include: includes,
    where: userQuery.status !== undefined ? { active: userQuery.status } : {},
    order
  })
}

export const findAllByGuild = async ({ guildQuery = {} }) => {
  if (!await findGuild({ id: guildQuery.id })) {
    throw new ValidationError(404, `Guild ${guildQuery.id} not found`)
  }

  return await User.findAll({
    include: {
      model: Guild,
      as: 'guilds',
      through: {
        attributes: []
      },
      where: {
        [Op.and]: [{ status: true }, { id: guildQuery.id }]
      }
    },
    where: { active: true },
    order: [['username', 'ASC']]
  })
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

  let userDB = await User.findByPk(id, {
    include: includes
  })

  if (userDB) {
    return userDB
  }

  if (guildStatus) {
    return null
  }

  userDB = await User.findByPk(id, { include: { model: Role, as: 'role' } })
  if (includeGuilds) {
    userDB.guilds = []
  }

  return userDB
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

export const findUser = async (options, includeRoles = false, includeGuilds = false) => {
  const includes = []
  if (includeRoles) {
    includes.push({
      model: Role,
      as: 'role',
      attributes: ['name']
    })
  }

  if (includeGuilds) {
    includes.push({
      model: Guild,
      as: 'guilds',
      attributes: ['id'],
      through: {
        attributes: []
      }
    })
  }

  if (includeRoles || includeGuilds) {
    options.include = includes
  }

  return await User.findOne(options)
}

export const userHasGuild = async (userId, guildId) => {
  const userDB = await User.findByPk(userId, {
    include: {
      model: Guild,
      as: 'guilds',
      through: {
        attributes: []
      },
      where: { id: guildId }
    }
  })

  return userDB !== null
}
