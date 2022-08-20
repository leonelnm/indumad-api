import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'

// Schemas
export const schemaToCreateClient = Joi.object({
  nif: Joi.string().min(3).max(25).trim(),
  name: Joi.string().min(3).max(100).required().trim(),
  phone: Joi.string().min(5).max(15).alphanum().required().trim()
})

const schemaToUpdateClient = Joi.object({
  nif: Joi.string().min(3).max(25),
  name: Joi.string().min(3).max(100),
  phone: Joi.string().min(5).alphanum().max(15)
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
