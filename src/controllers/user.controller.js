import { compareUser } from '../helper/compare.js'
import { toNewUser, toPasswordUpdate, toUserUpdate } from '../helper/converter.js'
import { encryptPassword, validatePassword } from '../services/auth.service.js'
import { createUser, findAll, findUser, findUserById, findUserWithRoles } from '../services/user.service.js'
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
    // validate id
    const { error: errorId, value: id } = validateIdField(req.params.id)
    if (errorId) {
      return res.status(400).json({ msg: errorId }).end()
    }

    const { error, value: userFromRequest } = validateUserUpdateSchema(req.body)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const userUpdate = toUserUpdate(userFromRequest)
    const userDB = await findUserWithRoles({ id })
    const { changes, userDB: userWithChanges } = compareUser(userDB, userUpdate)
    if (changes) {
      userWithChanges.save()
    }

    res.json(userWithChanges).end()
  } catch (error) {
    next(error)
  }
}

export const findAllHandler = async (req, res, next) => {
  try {
    const queryParams = req.query
    console.log({ queryParams })

    const response = await findAll()
    return res.json(response).end()
  } catch (error) {
    next(error)
  }
}

export const findByIdHandler = async (req, res, next) => {
  try {
    const response = await findUserById(req.params.id)
    if (response === null) {
      return res.status(404).json({ msg: 'Not found!' }).end()
    }
    return res.json(response).end()
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

    // Si encuentra y password es correcta,
    // permite cambiar la password
    if (userDB && validatePassword({ password: updatePassword.password, user: userDB })) {
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
