import Joi from 'joi'

const referenceSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(15)
    .alphanum()
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

export const validateReferenceSchema = (reference = {}) => {
  if (reference.name) {
    reference.name = reference.name.trim().toUpperCase()
  }
  const { error, value } = referenceSchema.validate(reference)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, name: value.name }
}
