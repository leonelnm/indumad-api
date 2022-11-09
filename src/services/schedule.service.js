import { Job } from '../models/job.model.js'
import { Schedule } from '../models/schedule.model.js'

export const createSchedule = async (schedule) => {
  return await Schedule.create(schedule, {
    include: [{ model: Job, as: 'job' }]
  })
}

export const findAll = async (where = {}) => {
  return await Schedule.findAll({
    where
  })
}

export const findAllByEmployee = async ({ userId }) => {
  return await Schedule.findAll({
    include: {
      model: Job,
      as: 'job',
      where: { employeeId: userId }
    }
  })
}

export const findSchedule = async (pk) => {
  return await Schedule.findByPk(pk)
}

export const deleteReference = async (id) => {
  return await Schedule.destroy({
    where: { id }
  })
}
