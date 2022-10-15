import Joi from 'joi'

const followUpNoteSchema = Joi.object({
  text: Joi.string().trim().max(5000).required()
})

export const validateFollowUpNoteSchema = (data = {}) => {
  const { error, value } = followUpNoteSchema.validate(data)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, value }
}
