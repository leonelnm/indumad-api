import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'
import { JobStateTypeAsList } from '../types/jobStateEnumType.js'
import { PriorityTypeAsList } from '../types/levelEnumType.js'
import { schemaToCreateClient } from './clientSchemaValidator.js'
import { schemaToCreateContact } from './contactSchemaValidator.js'

// Schemas
const schemaToCreateJob = Joi.object({
  extReference: Joi.string().allow('').trim().max(50),
  incidentInfo: Joi.string().trim().max(4000).required(),
  priority: Joi.string().valid(...PriorityTypeAsList),
  iva: Joi.number().min(1),
  employee: Joi.number(),
  client: schemaToCreateClient.required(),
  contact: schemaToCreateContact.required(),
  reference: Joi.number().required(),
  guild: Joi.number().required()
})

const schemaToUpdateJob = Joi.object({
  extReference: Joi.string().allow('').trim().max(50),
  incidentInfo: Joi.string().trim().max(4000),
  priority: Joi.string().valid(...PriorityTypeAsList),
  iva: Joi.number().min(1),
  state: Joi.string().valid(...JobStateTypeAsList),
  employee: Joi.number(),
  client: schemaToCreateClient,
  contact: schemaToCreateContact,
  reference: Joi.number(),
  guild: Joi.number()
})

// Validates
export const validateJobToCreate = (data = {}) => {
  const { error, value } = schemaToCreateJob.validate(data)
  return { error: getMsgErrorJoiValidation(error), value }
}

// Validates
export const validateJobToUpdate = (data = {}) => {
  const { error, value } = schemaToUpdateJob.validate(data)
  return { error: getMsgErrorJoiValidation(error), value }
}
