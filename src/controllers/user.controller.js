import { compareUser } from '../helper/compare.js'
import { toNewUser, toPasswordUpdate, userdbListToForm, userdbToFullForm } from '../helper/converter.js'
import { authorizedRoles, isGestor, validateRole } from '../helper/utils.js'
import { encryptPassword, validatePassword } from '../services/auth.service.js'
import { findRole } from '../services/role.service.js'
import { createUser, findAll, findUser, findUserById } from '../services/user.service.js'
import { validateIdField, validatePasswordField } from '../validations/fieldValidator.js'
import { validateUserSchema, validateUserUpdateSchema } from '../validations/userSchemaValidator.js'

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
    const userDB = await findUser({ where }, true)
    const { changes, userDB: userWithChanges } = compareUser(userDB, userFromRequest)

    if (userFromRequest.role) {
      const { name: role } = userWithChanges.role.toJSON()
      if (role !== userFromRequest.role) {
        const roleDB = await findRole(userFromRequest.role)
        userWithChanges.setRole(roleDB)
        await userWithChanges.save()
      }
    }

    if (changes) {
      await userWithChanges.save(Object.keys(userFromRequest))
    }

    res.json(userdbToFullForm(await userWithChanges.reload())).end()
  } catch (error) {
    next(error)
  }
}

export const findAllHandler = async (req, res, next) => {
  try {
    const response = await findAll()
    const users = userdbListToForm(response)
    return res.json(users).end()
  } catch (error) {
    next(error)
  }
}

export const findByIdHandler = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id)
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
        validatePassword({ password: updatePassword.password, user: userDB }) ||
        validateRole({ userRoles, authorizedRoles: authorizedRoles.gestor })
      )) {
      userDB.password = encryptPassword({ password: updatePassword.newpassword })
      await userDB.save()

      delete userDB.password // quitar password para no return
      return res.json(userDB).end()
    }

    return res.status(400).json({ msg: 'User not found or bad credentials!' }).end()
  } catch (error) {
    next(error)
  }
}
