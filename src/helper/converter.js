import { getInvoiceDateFromJobList } from '../services/billing.service.js'
import { JobStateType } from '../types/jobStateEnumType.js'

export const toNewUser = (userFromRequest) => {
  const newUser = {
    username: userFromRequest.username.toLowerCase(),
    password: userFromRequest.password,
    name: userFromRequest.name,
    lastname: userFromRequest.lastname,
    dni: userFromRequest.dni,
    phone: userFromRequest.phone,
    role: userFromRequest.role,
    active: true,
    guilds: userFromRequest.guilds
  }

  return newUser
}

export const toUserUpdate = (userFromRequest) => {
  const updateUser = {
    username: userFromRequest.username,
    name: userFromRequest.name,
    lastname: userFromRequest.lastname,
    phone: userFromRequest.phone
  }

  return updateUser
}

export const toPasswordUpdate = ({ idFromParams, dataFromRequest = {} }) => {
  const updatePassword = {}
  updatePassword.id = idFromParams
  updatePassword.newpassword = dataFromRequest.newpassword
  return updatePassword
}

export const userdbToFullForm = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    lastname: user.lastname,
    dni: user.dni,
    phone: user.phone,
    active: user.active,
    createdAt: user.createdAt,
    role: rolesToSimpleList(user.role),
    guilds: user.guilds
  }
}

export const userdbToSimpleForm = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    dni: user.dni,
    lastname: user.lastname,
    active: user.active,
    role: rolesToSimpleList(user.role),
    guilds: user.guilds
  }
}

export const userdbListToForm = (userList = []) => {
  if (!Array.isArray(userList) || userList.length === 0) return []
  return userList.map(userdbToSimpleForm)
}

export const rolesToSimpleList = (role = {}) => {
  return role ? role.name : ''
}

// Guild or Reference
export const toGuildOrReferencedUpdate = ({ dataFromRequest = {} }) => {
  const update = {}
  if (dataFromRequest?.name) {
    update.name = dataFromRequest.name.toUpperCase()
  }
  if ('status' in dataFromRequest) {
    update.status = dataFromRequest.status
  }

  return update
}

export const jobToForm = (job = {}, unreadMessages = 0) => {
  const form = { ...job }
  form.hasDeliveryNote = job.state !== JobStateType.INITIAL
  form.pendingApproval = job.state === JobStateType.BUDGET_VALIDATE
  form.allowSendBudget = job.state === JobStateType.PENDING_BUDGET
  form.inProgress = job.state === JobStateType.BUDGET_AUTHORIZED
  form.unreadMessages = unreadMessages

  return form
}

export const jobListToForm = (list = [], unreadMessages = []) => {
  return list.map(job => jobToForm(job.toJSON(), filterUnreadMessagesByJob(unreadMessages, job.id)))
}

const filterUnreadMessagesByJob = (list = [], id) => {
  const job = list.find(item => item.jobId === id)
  return job ? job.unread * 1 : 0
}

export const jobToDeliveryNote = ({ job = undefined }) => {
  const deliveryNote = {}

  if (job) {
    deliveryNote.id = job.id
    deliveryNote.extReference = job.extReference
    deliveryNote.createAt = job.createdAt
    deliveryNote.client = {
      nif: job.client.nif,
      name: job.client.name,
      phone: job.client.phone
    }

    deliveryNote.contact = {
      name: job.contact.name,
      address: job.contact.address,
      phone: job.contact.phone
    }
    deliveryNote.description = job.incidentInfo
    deliveryNote.worker = `${job.employee.name} ${job.employee.lastname}`
    deliveryNote.guild = job.guild.name
    deliveryNote.reference = job.reference.name
  }

  return deliveryNote
}

export const employeeScheduleToForm = ({ description, dateTime, duration, jobId }) => {
  return {
    dateTime,
    description,
    duration,
    jobId
  }
}

export const employeeListScheduleToForm = (list) => {
  return list.map(employeeScheduleToForm)
}

export const jobOnInvoice = (job) => {
  return {
    id: job.id,
    start: job.createdAt,
    end: job.closedAt,
    client: job.client.name,
    contact: job.contact.name,
    address: job.contact.address,
    price: job.budgetProposal,
    worker: `${job.employee.name} ${job.employee.lastname}`
  }
}

export const jobListOnInvoice = (list = []) => {
  return list.map(jobOnInvoice)
}

export const invoiceDBToForm = (invoice) => {
  return {
    amountJobs: invoice.amountJobs,
    invoiceDate: invoice.invoiceDate,
    iva: invoice.iva,
    subtotal: invoice.subtotal,
    total: invoice.total,
    jobs: jobListOnInvoice(invoice.getDataValue('Jobs'))
  }
}

export const invoiceDBListToForm = (invoiceDBList = []) => {
  return invoiceDBList.map(invoiceDBToForm)
}

export const invoiceDBListUserToForm = (invoiceDBList = [], userDB) => {
  const fullname = `${userDB.name} ${userDB.lastname}`
  return invoiceDBList.map(invoice => convertCustomInvoice(invoice, fullname))
}

const convertCustomInvoice = (invoiceDB, fullname) => {
  const jobs = invoiceDB.getDataValue('Jobs')
  return {
    ...getInvoiceDateFromJobList(jobs, invoiceDB.invoiceDate),
    fullname,
    jobs: jobListOnInvoice(jobs)
  }
}
