import { employeeListScheduleToForm } from '../helper/converter.js'
import { isGestor } from '../helper/utils.js'
import { findJob, scheduleJob } from '../services/job.service.js'
import { createSchedule, findAll, findAllByEmployee } from '../services/schedule.service.js'
import { validateScheduleSchema } from '../validations/scheduleSchemaValidator.js'

export const findByJobHandler = async (req, res, next) => {
  try {
    // const { status } = req.query
    // const where = status !== undefined ? { status } : {}

    // const response = await findAll(where)
    return res.json({ msg: 'findByJob' }).end()
  } catch (error) {
    next(error)
  }
}

export const findAllHandler = async (req, res, next) => {
  try {
    const { role } = req.user
    console.log(req.user)
    let list = []
    if (isGestor({ role })) {
      list = await findAll()
    } else {
      const scheduleList = await findAllByEmployee({ userId: req.user.id })
      list = employeeListScheduleToForm(scheduleList)
    }

    return res.json(list).end()
  } catch (error) {
    next(error)
  }
}

export const createHandler = async (req, res, next) => {
  try {
    const { error, value: scheduleRequest } = validateScheduleSchema(req.body)
    console.log('date', new Date())
    console.log({ scheduleRequest })
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const job = await findJob({ id: scheduleRequest.jobId })
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' }).end()
    }

    scheduleRequest.employeeId = req.user.id
    const scheduleDB = await createSchedule(scheduleRequest)

    await scheduleJob(job)

    return res.status(201).json(scheduleDB).end()
  } catch (error) {
    next(error)
  }
}

export const deleteHandler = async (req, res, next) => {
  try {
    // const { status } = req.query
    // const where = status !== undefined ? { status } : {}

    // const response = await findAll(where)
    return res.json({ msg: 'deleteHandler' }).end()
  } catch (error) {
    next(error)
  }
}
