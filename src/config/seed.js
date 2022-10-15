import { createGuild } from '../services/guild.service.js'
import { createJob } from '../services/job.service.js'
import { createReference } from '../services/reference.service.js'
import { createRole, findAll } from '../services/role.service.js'
import { createUser, findUser } from '../services/user.service.js'
import { PriorityType } from '../types/levelEnumType.js'
import { Environtment, RoleEnumType, toArrayStringFromObjectType } from '../types/roleEnumType.js'
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
        role: RoleEnumType.SUPERADMIN,
        active: true
      })
    }
  } catch (error) {
    console.log('Error creating superadmin')
  }
}

export const createData = async () => {
  try {
    if (Environtment.DEVELOPMENT === config.env) {
      const superadmin = await findUser({ where: { username: 'admin' } })
      if (superadmin) {
        const guildDB = await createGuild({ name: 'Gremio TEST' })
        const referenceDB = await createReference({ name: 'Referencia TEST' })

        // crea empleado
        const userDB = await createUser({
          username: 'test',
          password: '123456',
          name: 'test',
          lastname: 'test',
          dni: '00000001N',
          phone: '55555',
          role: RoleEnumType.AUTONOMO,
          active: true,
          guilds: [guildDB.id]
        })

        await createJob(
          {
            extReference: 'externa TEST',
            priority: PriorityType.NORMAL,
            incidentInfo: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
            iva: '12',
            client: {
              nif: '    ',
              name: 'clienteEmptyMultWhite',
              phone: '12345'
            },
            contact: {
              name: 'contacto1',
              address: 'address1',
              phone: '12345'
            },
            employee: userDB.id,
            reference: referenceDB.id,
            guild: guildDB.id
          }
        )
      }
    }
  } catch (error) {
    console.log('Error creating data')
    console.log(error)
  }
}
