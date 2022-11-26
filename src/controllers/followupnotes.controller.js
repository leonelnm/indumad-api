import { isGestor } from '../helper/utils.js'
import { createFollowUpNote, findFollowUpNoteByJob, markAsReadFollowUpNote } from '../services/followUpNote.service.js'
import { addBudgetByJobId, approvalBudgetByJobId, findJob, markJobAsCompleted } from '../services/job.service.js'
import { validateIdField } from '../validations/fieldValidator.js'
import { validateBudgetApprovalSchema, validateBudgetNoteSchema, validateFollowUpNoteSchema } from '../validations/followUpNotesSchemaValidator.js'

export const findAllByJobHandler = async (req, res, next) => {
  try {
    // validate id
    const { error, value: jobId } = validateIdField(req.params.id)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    // search jobId exist
    const job = await findJob({ id: jobId })
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' }).end()
    }

    // search all follow up notes
    const notes = await findFollowUpNoteByJob(jobId)

    return res.json(notes).end()
  } catch (error) {
    next(error)
  }
}

export const addFollowupNoteToJobHandler = async (req, res, next) => {
  try {
    // validate id
    const { error, value: jobId } = validateIdField(req.params.id)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const { error: errorSchema, value: note } = validateFollowUpNoteSchema(req.body)
    if (errorSchema) {
      return res.status(400).json({ msg: errorSchema }).end()
    }

    // search jobId exist
    const job = await findJob({ id: jobId })
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' }).end()
    }

    const gestor = isGestor({ role: req.user.role })

    if (gestor) {
      note.readByGestor = true
    } else {
      note.readByEmployee = true
    }

    note.ownerId = req.user.id
    note.jobId = jobId
    const noteDB = await createFollowUpNote(note)

    return res.status(201).json(noteDB).end()
  } catch (error) {
    next(error)
  }
}

export const markAsReadFollowUpNoteHandler = async (req, res, next) => {
  try {
    const { error, value: id } = validateIdField(req.params.id)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const gestor = isGestor({ role: req.user.role })

    const dataToUpdate = {
      ...(gestor ? { readByGestor: true } : { readByEmployee: true })
    }

    const response = await markAsReadFollowUpNote(id, dataToUpdate)

    if (response[0] === 0) {
      return res.status(200).json({ msg: 'No updated!' }).end()
    }

    return res.status(200).json({ msg: 'Update succesfully!' }).end()
  } catch (error) {
    next(error)
  }
}

export const addBudgetToJobHandler = async (req, res, next) => {
  try {
    const { error: errorSchema, value } = validateBudgetNoteSchema(req.body)
    if (errorSchema) {
      return res.status(400).json({ msg: errorSchema }).end()
    }

    const jobId = req.params.id * 1
    const note = {
      text: value.text,
      isGestor: isGestor({ role: req.user.role }),
      ownerId: req.user.id,
      jobId
    }

    const { noteDB, jobDB } = await addBudgetByJobId({ jobId, budget: value.budget, note })
    if (!jobDB) {
      return res.status(404).json({ msg: 'Job not found' }).end()
    }

    return res.status(201).json(noteDB).end()
  } catch (error) {
    next(error)
  }
}

export const approveBudgetByJobHandler = async (req, res, next) => {
  try {
    const { error: errorSchema, value: { approve } } = validateBudgetApprovalSchema(req.body)
    if (errorSchema) {
      return res.status(400).json({ msg: errorSchema }).end()
    }

    const jobId = req.params.id * 1
    const note = {
      text: '',
      isGestor: isGestor({ role: req.user.role }),
      ownerId: req.user.id,
      jobId
    }

    const { noteDB, jobDB } = await approvalBudgetByJobId({ jobId, approve, note })
    if (!jobDB) {
      return res.status(404).json({ msg: 'Job not found' }).end()
    }

    return res.status(201).json(noteDB).end()
  } catch (error) {
    next(error)
  }
}

export const jobCompletedHandler = async (req, res, next) => {
  try {
    const jobId = req.params.id * 1
    const note = {
      text: '',
      isGestor: isGestor({ role: req.user.role }),
      ownerId: req.user.id,
      jobId
    }

    const { noteDB, jobDB } = await markJobAsCompleted({ jobId, note })
    if (!jobDB) {
      return res.status(404).json({ msg: 'Job not found' }).end()
    }

    return res.status(201).json(noteDB).end()
  } catch (error) {
    next(error)
  }
}
