import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'

// Schemas
export const schemaToCreateContact = Joi.object({
  name: Joi.string().min(3).max(80).required(),
  address: Joi.string().min(4).max(100).required(),
  phone: Joi.string().min(5).max(15).alphanum().required()
})

const schemaToUpdateContact = Joi.object({
  name: Joi.string().min(3).max(80),
  address: Joi.string().min(4).max(100),
  phone: Joi.string().min(5).alphanum().max(15)
})

// Validates
export const validateContactToCreate = (data = {}) => {
  const { error, value } = schemaToCreateContact.validate(data)
  return { error: getMsgErrorJoiValidation(error), value }
}

export const validateContactToUpdate = (data = {}) => {
  const { error, value } = schemaToUpdateContact.validate(data)
  return { error: getMsgErrorJoiValidation(error), value }
}
