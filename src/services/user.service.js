import { Role } from '../models/role.model.js'
import { User } from '../models/user.model.js'
import { findRoles } from './role.service.js'

export const createUser = async (user) => {
  const rolesDB = await findRoles(user.roles)
  console.log('Mis roles:', rolesDB.map(r => r.toJSON()))
  if (rolesDB.length === 0) {
    throw new Error('No se ha encontrado ningún role válido')
  }

  const userCreated = await User.create(user)
  console.log('User creado: ', userCreated.toJSON())

  for (const role of rolesDB) {
    console.log('añadiendo: ', role.toJSON())
    await userCreated.addRole(role)
  }

  const { dataValues: userFull } = await User.findOne({
    include: {
      model: Role,
      as: 'roles',
      through: {
        attributes: []
      }
    },
    where: { id: userCreated.id }
  })

  return userFull
}

export const findAll = async () => {
  return await User.findAll(
    /* {
    include: {
      model: Role,
      as: 'roles',
      through: {
        attributes: []
      }
    }
    } */
  )
}

export const findUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: {
      model: Role,
      as: 'roles',
      attributes: ['name'],
      required: true,
      through: {
        attributes: []
      }
    }
  })

  return user
}

export const findUserWithRoles = async (where = {}) => {
  console.log({ where })
  const user = await User.findOne({
    include: {
      model: Role,
      as: 'roles',
      attributes: ['name'],
      required: true,
      through: {
        attributes: []
      }
    },
    where
  })

  return user
}

export const findUserForLogin = async (username) => {
  return await User.findOne({
    attributes: ['id', 'username', 'password'],
    include: {
      model: Role,
      as: 'roles',
      attributes: ['name'],
      required: true,
      through: {
        attributes: []
      }
    },
    where: { username, active: true }
  })
}

export const findUser = async (options) => {
  return await User.findOne(options)
}
