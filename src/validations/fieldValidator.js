// Utils
import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'

// Schemas
const idSchema = Joi.number().required()

// Validates
export const validateIdField = (idFromRequest = {}) => {
  const { error, value } = idSchema.validate(idFromRequest)
  return { error: getMsgErrorJoiValidation(error), value }
}

const updatePasswordSchema = Joi.object({
  id: Joi.number().required(),
  password: Joi.string().min(6).required(),
  newpassword: Joi.string().min(6).required()
})
export const validatePasswordField = (updatePasswordFromRequest = {}) => {
  const { error, value } = updatePasswordSchema.validate(updatePasswordFromRequest)
  return { error: getMsgErrorJoiValidation(error), value }
}
