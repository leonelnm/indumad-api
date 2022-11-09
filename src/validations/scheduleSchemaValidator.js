import Joi from 'joi'

const duration = [0.5, ...[...Array(10).keys()].map(i => i + 1)]

// Schemas
const scheduleSchemaToCreate = Joi.object({
  jobId: Joi.number().required().greater(0),
  description: Joi.string().max(100),
  duration: Joi.number().valid(...duration).required(),
  dateTime: Joi.date().required()
})

export const validateScheduleSchema = (data = {}) => {
  const { error, value } = scheduleSchemaToCreate.validate(data)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, value }
}
