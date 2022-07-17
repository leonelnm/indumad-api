import Joi from 'joi'
import { RoleEnumType, toArrayStringFromObjectType } from '../types/roleEnumType.js'

const roles = toArrayStringFromObjectType(RoleEnumType)
const validateRoleItem = Joi.object({
  name: Joi.string().valid(...roles).required()
})

const userSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(4).alphanum().required(),
  lastname: Joi.string().min(4).alphanum().required(),
  dni: Joi.string().alphanum().required(),
  phone: Joi.string().min(5).alphanum().required(),
  roles: Joi.array().items(validateRoleItem)
})

export const validateUserSchema = (userFromRequest = {}) => {
  const { error, value } = userSchema.validate(userFromRequest)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, value }
}
