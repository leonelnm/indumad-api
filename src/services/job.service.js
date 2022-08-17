import { ValidationError } from '../exceptions/ValidationError.js'
import { Client } from '../models/client.model.js'
import { Contact } from '../models/contact.model.js'
import { Job } from '../models/job.model.js'
import { User } from '../models/user.model.js'
// import { findClient } from './client.service.js'
import { findUserById } from './user.service.js'

export const findAll = async () => {
  return await Job.findAll(
  //   {
  //   include: [
  //     {
  //       model: Client,
  //       attributes: ['nif', 'name', 'phone']
  //     },
  //     {
  //       model: Contact,
  //       attributes: ['name', 'address', 'phone']
  //     },
  //     {
  //       model: User,
  //       as: 'employee',
  //       attributes: ['id', 'username', 'name', 'lastname', 'dni', 'phone']
  //     }
  //   ]
  // }
  )
}

export const createJob = async ({ client = null, employee = null, ...job }) => {
  const includes = [
    { model: Contact, as: 'contact' },
    { model: Client, as: 'client' }
  ]

  if (employee) {
    const employeeDB = await findUserById(employee)
    if (!employeeDB) {
      throw new ValidationError(404, `employee id:[${employee}] not found!`)
    }
    job.employeeId = employeeDB.id
    includes.push({ model: User, as: 'employee' })
  }

  // FIXME find client before creating job to keep the same client on some jobs
  // const clientDB = await findClient({ nif: client.nif })
  // if (clientDB) {
  //   console.log('cliente encontrado')
  //   job.clientId = clientDB.id
  // } else {
  //   job.client = client
  // }
  job.client = client

  return await Job.create(job, {
    include: includes
  })
}
