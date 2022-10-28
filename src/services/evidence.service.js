import { Evidence } from '../models/evidence.model.js'
import { Job } from '../models/job.model.js'
import { User } from '../models/user.model.js'
import { deleteImage, uploadImage } from './images.service.js'

export const createEvidence = async ({ ownerId, jobId, image }) => {
  const imgUploaded = await uploadImage(image, jobId)

  const evidence = {
    jobId,
    ownerId,
    ...imgUploaded
  }

  return await Evidence.create(evidence, {
    include: [
      { model: Job, as: 'job' },
      { model: User, as: 'owner' }
    ]
  })
}

export const deleteEvidence = async ({ id, name }) => {
  deleteImage(name)

  return await Evidence.destroy({
    where: {
      id
    }
  })
}

export const findAllEvidenceByJob = async ({ jobId }) => {
  return await Evidence.findAll({
    where: { jobId },
    order: [
      ['createdAt', 'DESC']
    ]
  })
}

export const findEvidenceByPK = async (id) => {
  return await Evidence.findByPk(id)
}
