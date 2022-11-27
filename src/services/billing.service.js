import { Op } from 'sequelize'
import config from '../config/config.js'
import { getBeginEndDateFromMonth, getMonthAndYearToBilling } from '../helper/date.js'
import { Invoice } from '../models/invoice.js'
import { Job } from '../models/job.model.js'
import { findJobsToBilling } from './job.service.js'

export const getInvoiceByDate = async ({ year, month, userId = undefined }) => {
  const { begin, end } = getBeginEndDateFromMonth({ year, month })

  return await Invoice.findOne({
    where: {
      invoiceDate: {
        [Op.between]: [begin, end]
      }
    },
    include: [
      {
        model: Job,
        where: {
          ...(userId && { employeeId: userId })
        }
      }
    ]
  })
}

export const getAllInvoicesByYear = async ({ year, userId = undefined }) => {
  const { begin, end } = getBeginEndDateFromMonth({ year })

  return await Invoice.findAll({
    where: {
      invoiceDate: {
        [Op.between]: [begin, end]
      }
    },
    include: [
      {
        model: Job,
        where: {
          ...(userId && { employeeId: userId })
        }
      }
    ]
  })
}

export const executeBillingProcessOnDemand = async ({ year = undefined, month = undefined }) => {
  try {
    console.log('INIT Billing process OnDemand...')

    let date = { year, month }
    if (!year || !month) {
      date = getMonthAndYearToBilling()
    }
    await createInvoice(date)
    console.log('END Billing process OnDemand')
    return true
  } catch (error) {
    console.log('ERROR: END Billing process OnDemand with errors!', error)
    return false
  }
}

export const executeCronBillingProcess = async () => {
  if (!config.billing.cronEnabled) {
    console.log('CRON Billing process is DISABLED!')
    return
  }

  try {
    console.log('INIT CRON Billing process...')

    const date = getMonthAndYearToBilling()
    await createInvoice(date)

    console.log('END CRON Billing process')
  } catch (error) {
    console.log('ERROR: END CRON Billing process with errors!', error)
  }
}

const createInvoice = async ({ year, month }) => {
  const jobs = await findJobsToBilling({ year, month })

  if (jobs.length === 0) {
    console.log('STEP: [billing.service -> createInvoice] There are no jobs to generate invoice!')
    return
  }

  console.log(`STEP: [billing.service -> createInvoice] Invoice is being generated with ${jobs.length} jobs!`)
  const { end: invoiceDate } = getBeginEndDateFromMonth({ year, month })
  const invoice = getInvoiceDateFromJobList(jobs, invoiceDate)
  const invoiceDB = await Invoice.create(invoice)

  await invoiceDB.addJobs(jobs)
}

export const getInvoiceDateFromJobList = (jobList = [], invoiceDate) => {
  let subtotal = 0
  for (const job of jobList) {
    subtotal += job.budgetProposal * 1
  }
  const { iva, total } = getTotalWithIva({ value: subtotal })

  return {
    subtotal: subtotal.toFixed(2),
    iva,
    total,
    invoiceDate,
    amountJobs: jobList.length
  }
}

export const getTotalWithIva = ({ iva = 21, value }) => {
  const percentage = ((iva / 100) * value).toFixed(2)
  return {
    iva: percentage,
    total: ((value * 1) + (percentage * 1)).toFixed(2)
  }
}
