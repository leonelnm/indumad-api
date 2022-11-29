import { Op } from 'sequelize'
import { ValidationError } from '../exceptions/ValidationError.js'
import { getBeginEndDateFromMonth } from '../helper/date.js'
import messages, { getCustomMessage } from '../helper/messages.js'
import { Client } from '../models/client.model.js'
import { Contact } from '../models/contact.model.js'
import { Guild } from '../models/guild.model.js'
import { Job } from '../models/job.model.js'
import { Reference } from '../models/reference.model.js'
import { User } from '../models/user.model.js'
import { JobStateType } from '../types/jobStateEnumType.js'
import { getTotalWithIva } from './billing.service.js'
import { registerNewNote } from './followUpNote.service.js'
import { findGuild } from './guild.service.js'
import { findReference } from './reference.service.js'
// import { findClient } from './client.service.js'
import { findUserById } from './user.service.js'

export const findAll = async ({ state = undefined }) => {
  return await Job.findAll({
    where: { ...(state && { state }) },
    order: [['createdAt', 'DESC']]
  })
}

export const findJobByEmployee = async ({ userId = '', state = undefined }) => {
  return await Job.findAll({
    where: { ...(state && { state }) },
    order: [['createdAt', 'DESC']],
    include: [
      { model: User, as: 'employee', where: { id: userId } },
      { model: Client, as: 'client' },
      { model: Contact, as: 'contact' },
      { model: Guild, as: 'guild' },
      { model: Reference, as: 'reference' }
    ]
  })
}

export const createJob = async ({ client = null, employee = null, reference = null, guild = null, ...job }) => {
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

    // cambia estado si llega con empleado
    job.state = JobStateType.PENDING_VISITED
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

  if (reference) {
    const referenceDB = await findReference({ id: reference })
    if (!referenceDB) {
      throw new ValidationError(404, `reference id:[${reference}] not found!`)
    }
    job.referenceId = referenceDB.id
    includes.push({ model: Reference, as: 'reference' })
  }

  if (guild) {
    const guildDB = await findGuild({ id: guild })
    if (!guildDB) {
      throw new ValidationError(404, `guild id:[${guild}] not found!`)
    }
    job.guildId = guildDB.id
    includes.push({ model: Guild, as: 'guild' })
  }

  return await Job.create(job, {
    include: includes
  })
}

export const updateJob = async ({ client = null, employee = null, reference = null, guild = null, ...job }) => {
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

    // cambia estado si llega con empleado
    job.state = JobStateType.PENDING_VISITED
  }

  job.client = client

  if (reference) {
    const referenceDB = await findReference({ id: reference })
    if (!referenceDB) {
      throw new ValidationError(404, `reference id:[${reference}] not found!`)
    }
    job.referenceId = referenceDB.id
    includes.push({ model: Reference, as: 'reference' })
  }

  if (guild) {
    const guildDB = await findGuild({ id: guild })
    if (!guildDB) {
      throw new ValidationError(404, `guild id:[${guild}] not found!`)
    }
    job.guildId = guildDB.id
    includes.push({ model: Guild, as: 'guild' })
  }

  return await Job.create(job, {
    include: includes
  })
}

export const findJob = async (where = {}) => {
  return await Job.findOne({
    include: [
      { model: Contact, as: 'contact' },
      { model: Client, as: 'client' },
      { model: Guild, as: 'guild' },
      { model: Reference, as: 'reference' }
    ],
    where
  })
}

export const checkJobAssignToEmployee = async ({ userId = '', jobId }) => {
  console.log('checkJobAssignToEmployee')
  console.log({ userId }, { jobId })

  return await Job.findOne({
    where: { id: jobId },
    include: [
      { model: User, as: 'employee', where: { id: userId } }
    ]
  })
}

export const scheduleJob = async (jobDB) => {
  if (jobDB.state === JobStateType.PENDING_VISITED) {
    jobDB.state = JobStateType.PENDING_BUDGET
    await jobDB.save()

    console.log(`Job ${jobDB.id} state updated from ${JobStateType.PENDING_VISITED} to ${JobStateType.PENDING_BUDGET}`)
  }
}

export const addBudgetByJobId = async ({ jobId, budget, note = {} }) => {
  let noteDB
  const jobDB = await findJob({ id: jobId })
  if (jobDB) {
    jobDB.budgetProposal = budget
    jobDB.state = JobStateType.BUDGET_VALIDATE
    await jobDB.save()

    noteDB = await registerNewNote({ ...note, title: messages.budget.add, nextLine: getCustomMessage(messages.budget.total, budget) })
  }

  return { noteDB, jobDB }
}

export const markJobAsCompleted = async ({ jobId, note = {} }) => {
  let noteDB
  const jobDB = await findJob({ id: jobId })
  if (jobDB) {
    jobDB.state = JobStateType.DONE
    jobDB.closedAt = new Date()
    await jobDB.save()

    noteDB = await registerNewNote({ ...note, title: messages.job.complete })
  }

  return { noteDB, jobDB }
}

export const approvalBudgetByJobId = async ({ jobId, approve, note = {} }) => {
  let noteDB
  const jobDB = await findJob({ id: jobId })
  if (jobDB) {
    let title
    if (approve) {
      const { total } = getTotalWithIva({ iva: jobDB.iva, value: jobDB.budgetProposal })

      jobDB.budgetAccepted = true
      jobDB.budgetFinal = total
      jobDB.state = JobStateType.BUDGET_AUTHORIZED
      title = messages.budget.aproved
    } else {
      jobDB.budgetAccepted = false
      jobDB.budgetProposal = ''
      jobDB.state = JobStateType.PENDING_BUDGET
      title = messages.budget.rejected
    }

    await jobDB.save()

    noteDB = await registerNewNote({ ...note, title })
  }

  return { noteDB, jobDB }
}

export const findJobsToBilling = async ({ year, month }) => {
  console.log('STEP: [job.service -> findJobsToBilling]')
  const { begin, end } = getBeginEndDateFromMonth({ year, month })

  return await Job.scope('billing').findAll({
    where: {
      state: JobStateType.DONE,
      closedAt: {
        [Op.between]: [begin, end]
      },
      InvoiceId: {
        [Op.eq]: null
      }
    }
  })
}

export const countJobByReference = async ({ referenceName }) => {
  return Job.count({
    include: [
      {
        model: Reference,
        as: 'reference',
        where: { name: referenceName }
      }]
  })
}
