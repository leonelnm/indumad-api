import { createJob, findAll } from '../services/job.service.js'
import { validateJobToCreate } from '../validations/jobSchemaValidator.js'

export const findAllHandler = async (req, res, next) => {
  try {
    const response = await findAll()
    return res.json(response).end()
  } catch (error) {
    next(error)
  }
}

export const createHandler = async (req, res, next) => {
  try {
    const { error, value: jobFromRequest } = validateJobToCreate(req.body)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const response = await createJob(jobFromRequest)
    return res.status(201).json(response).end()
  } catch (error) {
    next(error)
  }
}
