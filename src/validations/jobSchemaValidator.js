import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'
import { JobStateTypeAsList } from '../types/jobStateEnumType.js'
import { PriorityTypeAsList } from '../types/levelEnumType.js'
import { schemaToCreateClient } from './clientSchemaValidator.js'
import { schemaToCreateContact } from './contactSchemaValidator.js'

// Schemas
const schemaToCreateJob = Joi.object({
  extReference: Joi.string().trim().max(50),
  incidentInfo: Joi.string().trim().max(4000).required(),
  priority: Joi.string().valid(...PriorityTypeAsList),
  iva: Joi.number().min(1),
  employee: Joi.number(),
  client: schemaToCreateClient.required(),
  contact: schemaToCreateContact.required()
})

const schemaToUpdateJobState = Joi.object({
  state: Joi.string().valid(...JobStateTypeAsList)
})

// Validates
export const validateJobToCreate = (data = {}) => {
  const { error, value } = schemaToCreateJob.validate(data)
  return { error: getMsgErrorJoiValidation(error), value }
}
