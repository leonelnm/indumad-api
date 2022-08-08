import { Role } from '../models/role.model.js'
import { User } from '../models/user.model.js'
import { findRole } from './role.service.js'

export const createUser = async (user) => {
  console.log('User antes de crear', user)
  const roleDB = await findRole(user.role)
  if (!roleDB) {
    throw new Error('No se ha encontrado ningún role válido')
  }
  console.log('Role on db', roleDB)

  const userCreated = await User.create(user)
  await userCreated.setRole(roleDB)

  const { dataValues: userFull } = await User.findOne({
    include: {
      model: Role,
      as: 'role'
    },
    where: { id: userCreated.id }
  })

  return userFull
}

export const findAll = async () => {
  return await User.findAll(
    {
      include: {
        model: Role,
        as: 'role',
        attributes: ['name']
      },
      order: [
        ['username', 'ASC']
      ]
    }
  )
}

export const findUserById = async (id) => {
  return await User.findByPk(id, {
    include: {
      model: Role,
      as: 'role'
    }
  })
}

export const findUserWithRoles = async (where = {}) => {
  const user = await User.findOne({
    include: {
      model: Role,
      as: 'roles',
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

export const findUser = async (options) => {
  return await User.findOne(options)
}
