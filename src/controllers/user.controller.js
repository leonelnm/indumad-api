import { createUser, findAll, findUserById } from '../services/user.service.js'

export const createUserHandler = async (req, res, next) => {
  // Validaciones

  try {
    const response = await createUser(req.body)
    return res.json(response).end()
  } catch (error) {
    next(error)
  }
}

export const findAllHandler = async (req, res) => {
  const response = await findAll()
  return res.json(response).end()
}

export const findByIdHandler = async (req, res) => {
  const response = await findUserById(req.params.id)
  return res.json(response).end()
}
