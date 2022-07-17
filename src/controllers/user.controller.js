import { toNewUser } from '../helper/converter.js'
import { createUser, findAll, findUserById } from '../services/user.service.js'
import { validateUserSchema } from '../validations/userSchemaValidator.js'

export const createUserHandler = async (req, res, next) => {
  try {
    const { error, value: userFromRequest } = validateUserSchema(req.body)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    } else {
      const newUser = toNewUser(userFromRequest)
      const response = await createUser(newUser)
      return res.status(201).json(response).end()
    }
  } catch (error) {
    next(error)
  }
}

export const findAllHandler = async (req, res, next) => {
  try {
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
