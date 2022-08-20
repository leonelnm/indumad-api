import { createRole, findAll } from '../services/role.service.js'
import { createUser, findUser } from '../services/user.service.js'
import { RoleEnumType, toArrayStringFromObjectType } from '../types/roleEnumType.js'
import config from './config.js'

export const createRoles = async () => {
  try {
    const rolesDbLength = (await findAll()).length
    const roles = toArrayStringFromObjectType(RoleEnumType)
    if (rolesDbLength !== roles.length) {
      for (const name of roles) {
        await createRole({ name })
      }
    }
  } catch (error) {
    console.log('Error creando roles')
  }
}

export const createSuperAdmin = async () => {
  try {
    const superadmin = await findUser({ where: { username: 'admin' } })
    if (!superadmin) {
      await createUser({
        username: 'admin',
        password: config.superadminPassword,
        name: 'admin',
        lastname: 'admin',
        dni: '00000000N',
        phone: '55555',
        role: 'SUPERADMIN',
        active: true
      })
    }
  } catch (error) {
    console.log('Error creating superadmin')
  }
}
