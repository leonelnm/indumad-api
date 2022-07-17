import Joi from 'joi'

const roleSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .alphanum()
    .required()
    .messages({
      'string.base': 'Field: name, debe ser un string',
      'string.empty': 'Field: name, no puede ser un campo vacío',
      'string.min': 'Field: name, debe tener mínimo {#limit} caracteres',
      'string.alphanum': 'Field: name, debe ser alfanumérico',
      'any.required': 'Field: name, es requerido'
    })
})

export const validateRoleSchema = (role = {}) => {
  if (role.name) {
    role.name = role.name.trim().toUpperCase()
  }
  const { error, value } = roleSchema.validate(role)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, name: value.name }
}
