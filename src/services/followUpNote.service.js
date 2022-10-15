import { Job } from '../models/job.model.js'
import { Note } from '../models/notes.model.js'
import { User } from '../models/user.model.js'

export const createFollowUpNote = async (note) => {
  return await Note.create(note, {
    include: [
      { model: Job, as: 'job' },
      { model: User, as: 'owner' }
    ]
  })
}

export const findFollowUpNoteByJob = async (jobId = '') => {
  return await Note.findAll({
    where: { jobId },
    order: [
      ['createdAt', 'ASC']
    ]
  })
}

export const markAsReadFollowUpNote = async (id, dataToUpdate = {}) => {
  return await Note.update(
    dataToUpdate,
    { where: { id } }
  )
}
