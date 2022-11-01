import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'
import { RoleEnumType, toArrayStringFromObjectType } from '../types/roleEnumType.js'

// Utils
const roles = toArrayStringFromObjectType(RoleEnumType)

// Schemas
const schemaToCreateUser = Joi.object({
  username: Joi.string().alphanum().required(),
  name: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
  phone: Joi.string().min(5).alphanum().required(),
  password: Joi.string().min(5).required(),
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
  role: Joi.string().valid(...roles),
  guilds: Joi.array().items(Joi.number())
})

const passwordRegex = '^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z[0-9]{6,}$'

const updatePasswordSchema = Joi.object({
  id: Joi.number().required(),
  newpassword: Joi.string().min(6).pattern(new RegExp(passwordRegex)).required()
    .messages({
      'string.min': 'newpassword is not valid; minimum six characters, at least one letter and one number',
      'string.pattern.base': 'newpassword is not valid; minimum six characters, at least one letter and one number'
    })
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
