import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'
import { RoleEnumType, toArrayStringFromObjectType } from '../types/roleEnumType.js'

// Utils
const roles = toArrayStringFromObjectType(RoleEnumType)
const validateRoleItem = Joi.object({
  name: Joi.string().valid(...roles).required()
})

// Schemas
const userBaseSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  name: Joi.string().min(4).required(),
  lastname: Joi.string().min(4).required(),
  phone: Joi.string().min(5).alphanum().required()
})

const userSchema = userBaseSchema.keys({
  password: Joi.string().min(6).required(),
  dni: Joi.string().alphanum().required(),
  roles: Joi.array().items(validateRoleItem)
})

// const userUpdateSchema = userBaseSchema.keys({})

// Validates
export const validateUserSchema = (userFromRequest = {}) => {
  const { error, value } = userSchema.validate(userFromRequest)
  return { error: getMsgErrorJoiValidation(error), value }
}

export const validateUserUpdateSchema = (userFromRequest = {}) => {
  console.log({ userFromRequest })
  const { error, value } = userBaseSchema.validate(userFromRequest)
  return { error: getMsgErrorJoiValidation(error), value }
}
