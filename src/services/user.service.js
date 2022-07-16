import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'

export const createUser = async (user) => {
  return await User.create(user)
}

export const findAll = async () => {
  try {
    const users = await User.findAll()
    return users
  } catch (error) {
    console.log(error)
    return { error: 'fail', stack: error.stack }
  }
}

export const findUserById = async (id) => {
  try {
    console.log({ id })
    return await User.findByPk(id)
  } catch (error) {
    console.log(error)
    return { error: 'fail', stack: error.stack }
  }
}

export const login = async ({ username, password }) => {
  const user = await User.findOne({
    attributes: ['id', 'username', 'password'],
    where: { username, active: true }
  })

  if (user && bcrypt.compareSync(password, user.password)) {
    return {
      id: user.id,
      username: user.username
    }
  }

  return null
}
