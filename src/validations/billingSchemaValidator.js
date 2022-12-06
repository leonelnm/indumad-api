import Joi from 'joi'

// Schemas
const scheduleSchemaSearchByYear = Joi.object({
  year: Joi.string()
})

export const validateSearchByYear = (data = {}) => {
  const { error, value } = scheduleSchemaSearchByYear.validate(data)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, value }
}
