import Joi from 'joi'
import { getMsgErrorJoiValidation } from '../helper/utils.js'

// Schemas
const guildSchemaToCreate = Joi.object({
  name: Joi.string()
    .min(3)
    .max(15)
    .required()
    .messages({
      'string.base': 'name, debe ser un string',
      'string.empty': 'name, no puede ser un campo vacío',
      'string.min': 'name, debe tener mínimo {#limit} caracteres',
      'string.max': 'name, debe tener máximo {#limit} caracteres',
      'string.alphanum': 'name, debe ser alfanumérico',
      'any.required': 'name, es requerido'
    })
})

const guildSchemaToUpdate = Joi.object({
  name: Joi.string()
    .min(3)
    .max(15)
    .messages({
      'string.base': 'name, debe ser un string',
      'string.empty': 'name, no puede ser un campo vacío',
      'string.min': 'name, debe tener mínimo {#limit} caracteres',
      'string.max': 'name, debe tener máximo {#limit} caracteres',
      'string.alphanum': 'name, debe ser alfanumérico'
    }),
  status: Joi.boolean()
})

const nameParameterSchema = Joi.string()
  .trim()
  .min(3)
  .max(15)
  .required()

export const validateNameParemeter = (name) => {
  const { error, value } = nameParameterSchema.validate(name)
  return { error: getMsgErrorJoiValidation(error), value }
}

export const validateGuildSchemaOnCreate = (guild = {}) => {
  if (guild.name) {
    guild.name = guild.name.trim().toUpperCase()
  }
  const { error, value } = guildSchemaToCreate.validate(guild)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, name: value.name }
}

export const validateGuildSchemaOnUpdate = (guild = {}) => {
  const { error, value } = guildSchemaToUpdate.validate(guild)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, value }
}
