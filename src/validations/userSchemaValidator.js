import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'
import { RoleEnumType, toArrayStringFromObjectType } from '../types/roleEnumType.js'

// Utils
const roles = toArrayStringFromObjectType(RoleEnumType)

// Schemas
const schemaToCreateUser = Joi.object({
  username: Joi.string().alphanum().required(),
  name: Joi.string().min(4).required(),
  lastname: Joi.string().min(4).required(),
  phone: Joi.string().min(5).alphanum().required(),
  password: Joi.string().min(6).required(),
  dni: Joi.string().alphanum().required(),
  role: Joi.string().valid(...roles).required(),
  guilds: Joi.array().items(Joi.number())
})

const userSchemaToUpdate = Joi.object({
  username: Joi.string().alphanum(),
  name: Joi.string().min(4),
  lastname: Joi.string().min(4),
  phone: Joi.string().min(5).alphanum()
})

const userSchemaToUpdateAsGestor = userSchemaToUpdate.keys({
  dni: Joi.string().alphanum(),
  active: Joi.boolean(),
  role: Joi.string().valid(...roles)
})

const updatePasswordSchema = Joi.object({
  id: Joi.number().required(),
  password: Joi.string().min(6).required(),
  newpassword: Joi.string().min(6).required()
})

// Validates
export const validateUserSchema = (userFromRequest = {}) => {
  const { error, value } = schemaToCreateUser.validate(userFromRequest)
  return { error: getMsgErrorJoiValidation(error), value }
}

export const validateUserUpdateSchema = (userFromRequest = {}, isGestor = false) => {
  const { error, value } = isGestor ? userSchemaToUpdateAsGestor.validate(userFromRequest) : userSchemaToUpdate.validate(userFromRequest)
  return { error: getMsgErrorJoiValidation(error), value }
}

export const validatePasswordField = (updatePasswordFromRequest = {}) => {
  const { error, value } = updatePasswordSchema.validate(updatePasswordFromRequest)
  return { error: getMsgErrorJoiValidation(error), value }
}
