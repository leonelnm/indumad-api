// Utils
import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'

// Schemas
const idSchema = Joi.number().required()
  .messages({
    'number.base': 'param must be number',
    'any.required': 'param is mandatory'
  })

// Validates
export const validateIdField = (idFromRequest = {}) => {
  const { error, value } = idSchema.validate(idFromRequest)
  return { error: getMsgErrorJoiValidation(error), value }
}

export const ParamType = {
  number: 'number',
  boolean: 'boolean',
  string: 'string',
  order: 'order'
}

export const validateFieldNumber = (type, name = 'not defined', data = undefined, required = false) => {
  let schema

  switch (type) {
    case 'number':
      schema = Joi.number()
      break
    case 'boolean':
      schema = Joi.boolean()
      break
    case 'string':
      schema = Joi.string()
      break
    case 'order':
      schema = Joi.string().valid('ASC', 'DESC')
      break

    default:
      return { error: `type: ${type} not defined` }
  }
  schema = required ? schema.required() : schema
  const { error, value } = schema.label(name).validate(data)
  return { error: getMsgErrorJoiValidation(error), value }
}
