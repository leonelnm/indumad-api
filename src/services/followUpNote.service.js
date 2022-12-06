import sequelize from 'sequelize'
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

export const getUnreadMessageByJobId = async ({ jobId, isGestor }) => {
  const where = { jobId }

  if (isGestor) {
    where.readByGestor = false
  } else {
    where.readByEmployee = false
  }

  return await Note.count({
    where
  })
}

// TODO search by job state
export const getAllUnreadMessage = async ({ isGestor }) => {
  const where = { }

  if (isGestor) {
    where.readByGestor = false
  } else {
    where.readByEmployee = false
  }

  return await Note.findAll({
    group: ['jobId'],
    attributes: ['jobId', [sequelize.fn('COUNT', 'jobId'), 'unread']],
    where,
    raw: true
  })
}

export const registerNewNote = async ({ text, isGestor = false, jobId, ownerId, title = undefined, nextLine = undefined }) => {
  let customText = title ? title + text : text
  if (nextLine) {
    customText = customText + nextLine
  }

  const note = {
    jobId,
    ownerId,
    text: customText
  }

  if (isGestor) {
    note.readByGestor = true
  } else {
    note.readByEmployee = true
  }

  return await createFollowUpNote(note)
}
