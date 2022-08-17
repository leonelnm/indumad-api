import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'

// Schemas
export const schemaToCreateClient = Joi.object({
  nif: Joi.string().min(3),
  name: Joi.string().min(3).required(),
  phone: Joi.string().min(5).alphanum().required()
})

const schemaToUpdateClient = Joi.object({
  nif: Joi.string().min(3),
  name: Joi.string().min(3),
  phone: Joi.string().min(5).alphanum()
})

// Validates
export const validateClientToCreate = (data = {}) => {
  const { error, value } = schemaToCreateClient.validate(data)
  return { error: getMsgErrorJoiValidation(error), value }
}

export const validateClientToUpdate = (data = {}) => {
  const { error, value } = schemaToUpdateClient.validate(data)
  return { error: getMsgErrorJoiValidation(error), value }
}
