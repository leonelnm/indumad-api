import Joi from 'joi'

const followUpNoteSchema = Joi.object({
  text: Joi.string().trim().max(5000).required()
})

const budgetNoteSchema = Joi.object({
  text: Joi.string().trim().max(5000).required(),
  budget: Joi.string().trim().required()
})

const budgetApprovalSchema = Joi.object({
  approve: Joi.boolean().required()
})

export const validateFollowUpNoteSchema = (data = {}) => {
  const { error, value } = followUpNoteSchema.validate(data)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, value }
}

export const validateBudgetNoteSchema = (data = {}) => {
  const { error, value } = budgetNoteSchema.validate(data)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, value }
}

export const validateBudgetApprovalSchema = (data = {}) => {
  const { error, value } = budgetApprovalSchema.validate(data)
  let errorMsg
  if (error) {
    errorMsg = error.message
  }

  return { error: errorMsg, value }
}
