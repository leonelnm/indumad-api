import { compareUser } from '../helper/compare.js'
import { toNewUser, toPasswordUpdate, userdbListToForm, userdbToFullForm } from '../helper/converter.js'
import { authorizedRoles, isGestor, validateRole } from '../helper/utils.js'
import { encryptPassword } from '../services/auth.service.js'
import { findRole } from '../services/role.service.js'
import { createUser, findAll, findAllByGuild, findUser, findUserById } from '../services/user.service.js'
import { findAll as findAllGuilds } from '../services/guild.service.js'
import { validateIdField, validateFieldNumber, ParamType } from '../validations/fieldValidator.js'
import { validatePasswordField, validateUserSchema, validateUserUpdateSchema } from '../validations/userSchemaValidator.js'
import { ValidationError } from '../exceptions/ValidationError.js'

export const createUserHandler = async (req, res, next) => {
  try {
    const { error, value: userFromRequest } = validateUserSchema(req.body)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const newUser = toNewUser(userFromRequest)
    const response = await createUser(newUser)
    return res.status(201).json(response).end()
  } catch (error) {
    next(error)
  }
}

export const updateUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params

    const { error, value: userFromRequest } = validateUserUpdateSchema(req.body, isGestor({ role: req.user.role }))
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const where = { id }
    const userDB = await findUser({ where }, true, userFromRequest.guilds !== undefined)

    if (!userDB) {
      return res.status(404).json({ msg: 'User not found' }).end()
    }

    const { changes, userDB: userWithChanges } = compareUser(userDB, userFromRequest)
    let saveBefore = false
    if (userFromRequest.role) {
      const { name: role } = userWithChanges.role.toJSON()
      if (role !== userFromRequest.role) {
        const roleDB = await findRole(userFromRequest.role)
        userWithChanges.setRole(roleDB)
        await userWithChanges.save()
        saveBefore = true
      }
    }

    if (userFromRequest.guilds !== undefined) {
      const guildIds = userDB.guilds.map(g => g.id)
      const guildsReq = userFromRequest.guilds

      if (guildIds.length !== guildsReq.length ||
        JSON.stringify(guildIds.sort()) !== JSON.stringify(guildsReq.sort())) {
        console.log('STEP - RUN save guilds')
        const guildsDB = await findAllGuilds({ id: guildsReq })
        if (guildsReq.length !== guildsDB.length) {
          throw new ValidationError(400, `Invalid Guild, check guilds: [${guildsReq}]`)
        }
        await userWithChanges.setGuilds(guildsDB)
      }
    }

    if (changes && !saveBefore) {
      await userWithChanges.save(Object.keys(userFromRequest))
    }

    res.json(userdbToFullForm(await userWithChanges.reload())).end()
  } catch (error) {
    next(error)
  }
}

/*
 * QueryParams: {
 *  guild: boolean,
 *  guildStatus: boolean, //to use guildStatus must be use guild
 *  status: boolean,
 *  order: ['ASC', 'DESC']
 * }
 */
export const findAllHandler = async (req, res, next) => {
  try {
    const { guild, guildStatus, status, order } = req.query

    // Param USER: {status, order}
    if (status) {
      const { error } = validateFieldNumber(ParamType.boolean, 'status', status)
      if (error) {
        return res.status(400).json({ msg: error }).end()
      }
    }

    if (order) {
      const { error } = validateFieldNumber(ParamType.order, 'order', order)
      if (error) {
        return res.status(400).json({ msg: error }).end()
      }
    }

    // Param GUILD: {guild, guildStatus}
    if (guild) {
      const { error } = validateFieldNumber(ParamType.boolean, 'guild', guild)
      if (error) {
        return res.status(400).json({ msg: error }).end()
      }
    }
    if (guildStatus) {
      const { error } = validateFieldNumber(ParamType.boolean, 'guildStatus', guildStatus)
      if (error) {
        return res.status(400).json({ msg: error }).end()
      }
    }

    const guildQuery = {
      include: guild,
      status: guildStatus
    }

    const userQuery = {
      status,
      order
    }

    const response = await findAll({ userQuery, guildQuery })
    const users = userdbListToForm(response)
    return res.json(users).end()
  } catch (error) {
    next(error)
  }
}

export const findAllByGuildIdHandler = async (req, res, next) => {
  try {
    const { guildId } = req.params
    const { error } = validateFieldNumber(ParamType.number, guildId, guildId, true)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const guildQuery = {
      id: guildId
    }

    const response = await findAllByGuild({ guildQuery })
    return res.json(response).end()
  } catch (error) {
    next(error)
  }
}

export const findByIdHandler = async (req, res, next) => {
  try {
    const { guild, guildStatus } = req.query

    if (guild) {
      const { error } = validateFieldNumber(ParamType.boolean, 'guild', guild)
      if (error) {
        return res.status(400).json({ msg: error }).end()
      }
    }
    if (guildStatus) {
      const { error } = validateFieldNumber(ParamType.boolean, 'guildStatus', guildStatus)
      if (error) {
        return res.status(400).json({ msg: error }).end()
      }
    }

    const user = await findUserById(req.params.id, guild, guildStatus)
    if (user === null) {
      return res.status(404).json({ msg: 'User not found' }).end()
    }
    return res.json(userdbToFullForm(user)).end()
  } catch (error) {
    next(error)
  }
}

export const toggleActiveUserHandler = async (req, res, next) => {
  try {
    const { error, value: id } = validateIdField(req.params.id)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const userDB = await findUserById(id)
    if (userDB) {
      userDB.active = !userDB.active
      await userDB.save()
      return res.json(userDB).end()
    }

    return res.status(404).json({ msg: 'User not found!' }).end()
  } catch (error) {
    next(error)
  }
}

export const updatePasswordHandler = async (req, res, next) => {
  try {
    const updatePassword = toPasswordUpdate({ idFromParams: req.params.id, dataFromRequest: req.body })
    const { error } = validatePasswordField(updatePassword)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    // Busca usuario en DB
    const userDB = await findUser({
      attributes: ['id', 'password'],
      where: { id: updatePassword.id, active: true }
    })

    const { roles: userRoles } = req.user

    // Si encuentra y password es correcta,
    // permite cambiar la password
    if (userDB &&
      (
        userDB.id === updatePassword.id * 1 ||
        validateRole({ userRoles, authorizedRoles: authorizedRoles.gestor })
      )) {
      userDB.password = encryptPassword({ password: updatePassword.newpassword })
      await userDB.save()

      return res.json({ msg: 'OK' }).end()
    }

    return res.status(400).json({ msg: 'User not found or bad credentials!' }).end()
  } catch (error) {
    next(error)
  }
}
