import { compare, compareJob } from '../helper/compare.js'
import { invoiceDBListToForm, invoiceDBListUserToForm, jobListToForm, jobToDeliveryNote, jobToForm } from '../helper/converter.js'
import { isGestor, removeEmptyValuesFromObject, removeNullValuesFromObject } from '../helper/utils.js'
import { executeBillingProcessOnDemand, getAllInvoicesByYear } from '../services/billing.service.js'
import { findClientByPk } from '../services/client.service.js'
import { findContactByPk } from '../services/contact.service.js'
import { getAllUnreadMessage, getUnreadMessageByJobId } from '../services/followUpNote.service.js'
import { findGuild } from '../services/guild.service.js'
import { createJob, findAll, findJob, findJobByEmployee } from '../services/job.service.js'
import { findReference } from '../services/reference.service.js'
import { findUserById, userHasGuild } from '../services/user.service.js'
import { JobStateType, JobStateTypeAsList } from '../types/jobStateEnumType.js'
import { validateSearchByYear } from '../validations/billingSchemaValidator.js'
import { validateIdField } from '../validations/fieldValidator.js'
import { validateJobToCreate, validateJobToUpdate } from '../validations/jobSchemaValidator.js'

export const findAllHandler = async (req, res, next) => {
  try {
    const { state } = req.query
    if (state && !JobStateTypeAsList.includes(state)) {
      return res.status(400).json({ msg: 'state not valid' }).end()
    }

    const { role } = req.user
    let list = []
    if (isGestor({ role })) {
      list = await findAll({ state })
    } else {
      list = await findJobByEmployee({ userId: req.user.id, state })
    }
    const listUnreadMessages = await getAllUnreadMessage({ isGestor: isGestor({ role }) })

    return res.json(jobListToForm(list, listUnreadMessages)).end()
  } catch (error) {
    next(error)
  }
}

export const createHandler = async (req, res, next) => {
  try {
    const dataFromRequest = removeEmptyValuesFromObject(req.body)
    const { error, value: jobFromRequest } = validateJobToCreate(dataFromRequest)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const jobDB = await createJob(jobFromRequest)
    return res.status(201).json(removeNullValuesFromObject(jobDB.toJSON())).end()
  } catch (error) {
    next(error)
  }
}

export const findJobHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const response = await findJob({ id })
    const unreadMessages = await getUnreadMessageByJobId({ jobId: id, isGestor: isGestor({ role: req.user.role }) })
    return res.json(jobToForm(response.toJSON(), unreadMessages)).end()
  } catch (error) {
    next(error)
  }
}

export const updateJobHandler = async (req, res, next) => {
  try {
    const dataFromRequest = removeEmptyValuesFromObject(req.body)
    const { error, value: jobFromRequest } = validateJobToUpdate(dataFromRequest)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const { id } = req.params
    const jobDB = await findJob({ id })
    if (!jobDB) {
      return res.status(404).json({ msg: 'Job not found' }).end()
    }

    // compare contact
    if (jobFromRequest.contact) {
      const contactDB = await findContactByPk(jobDB.contact.id)
      const { changes } = compare(contactDB, jobFromRequest.contact)
      if (changes) {
        await contactDB.save()
        console.log('STEP: updateJob -> contact updated')
      }
    }
    // compare client
    if (jobFromRequest.client) {
      const clientDB = await findClientByPk(jobDB.client.id)
      const { changes } = compare(clientDB, jobFromRequest.client)
      if (changes) {
        await clientDB.save()
        console.log('STEP: updateJob -> client updated')
      }
    }

    // compare guild
    if (jobFromRequest.guild) {
      const guildId = +jobFromRequest.guild
      if (jobDB.guild.id !== guildId) {
        const guildDB = await findGuild({ id: guildId })
        if (!guildDB) {
          return res.status(404).json(`guild id:[${guildId}] not found!`)
        }

        await jobDB.setGuild(guildDB)
        console.log('STEP: updateJob -> guild updated')
      }
    }

    // compare reference
    if (jobFromRequest.reference) {
      const referenceId = +jobFromRequest.reference
      if (jobDB.reference.id !== referenceId) {
        const referenceDB = await findReference({ id: referenceId })
        if (!referenceDB) {
          return res.status(404).json(`reference id:[${referenceId}] not found!`)
        }

        await jobDB.setReference(referenceDB)
        console.log('STEP: updateJob -> reference updated')
      }
    }

    // compare employee
    if (jobFromRequest.employee) {
      const employeeId = +jobFromRequest.employee
      if (!jobDB.employee || jobDB.employee.id !== employeeId) {
        if (!await userHasGuild(employeeId, jobDB.guild.id)) {
          return res.status(404).json(`employee id:[${employeeId}] don't have guild ${jobDB.guild.id} or don't exist`)
        }

        const employeeDB = await findUserById(employeeId)
        if (!employeeDB) {
          return res.status(404).json(`employee id:[${employeeId}] not found!`)
        }
        await jobDB.setEmployee(employeeDB)
        console.log('STEP: updateJob -> employee updated')
      }
      jobFromRequest.state = JobStateType.PENDING_VISITED
    }

    const { changes, jobDB: jobDBWithChanges, fields } = compareJob(jobDB, jobFromRequest)
    if (changes) {
      await jobDBWithChanges.save(fields)
    }

    // const response = await createJob(jobFromRequest)
    return res.status(201).json(await jobDB.reload()).end()
  } catch (error) {
    next(error)
  }
}

export const deliveryNoteByJobIdHandler = async (req, res, next) => {
  try {
    const { error, value: jobId } = validateIdField(req.params.id)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    // search jobId exist
    const job = await findJob({ id: jobId })
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' }).end()
    }

    if (job.state === JobStateType.INITIAL) {
      return res.status(400).json({ msg: 'Job has not yet been assigned to the worker' }).end()
    }

    return res.json(jobToDeliveryNote({ job })).end()
  } catch (error) {
    console.log('STEP: [deliveryNoteByJobId]', error)
    next(error)
  }
}

export const findAllBillingByYear = async (req, res, next) => {
  try {
    console.log('STEP: [INIT findAllBillingByYear]')

    const { error, value: { year } } = validateSearchByYear(req.query)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    let invoiceListForm
    const { role, id } = req.user
    if (isGestor({ role })) {
      const invoiceDBList = await getAllInvoicesByYear({ year })
      invoiceListForm = invoiceDBListToForm(invoiceDBList)
    } else {
      const userDB = await findUserById(id)
      if (!userDB) {
        return res.status(404).json({ msg: 'User not found' }).end()
      }

      const invoiceDBList = await getAllInvoicesByYear({ year, userId: id })
      invoiceListForm = invoiceDBListUserToForm(invoiceDBList, userDB)
    }

    return res.json(invoiceListForm).end()
  } catch (error) {
    console.log('STEP: [findAllBillingByYear]', error)
    next(error)
  }
}

export const createInvoiceOnDemand = async (req, res, next) => {
  try {
    console.log('STEP: [INIT findAllBillingByYear]')
    const { year, month } = req.body

    const processOK = await executeBillingProcessOnDemand({ year, month })
    if (processOK) {
      return res.status(201).end()
    }

    return res.status(400).end()
  } catch (error) {
    console.log('STEP: [findAllBillingByYear]', error)
    next(error)
  }
}
