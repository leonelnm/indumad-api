import { createEvidence, deleteEvidence, findAllEvidenceByJob, findEvidenceByPK } from '../services/evidence.service.js'
import { findJob } from '../services/job.service.js'
import { validateIdField } from '../validations/fieldValidator.js'

export const findAllHandler = async (req, res, next) => {
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

    const response = await findAllEvidenceByJob({ jobId })
    return res.json(response).end()
  } catch (error) {
    next(error)
  }
}

export const uploadHandler = async (req, res, next) => {
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

    // 1. Llega file válido
    const evidenceFile = req.file
    const evidenceDB = await createEvidence({ ownerId: req.user.id, jobId, image: evidenceFile })

    return res.status(201).json(evidenceDB).end()
  } catch (error) {
    console.log('error on upload')
    next(error)
  }
}

export const deleteHandler = async (req, res, next) => {
  try {
    // validate id
    const { error, value: id } = validateIdField(req.params.id)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const evidenceDB = await findEvidenceByPK(id)
    if (!evidenceDB) {
      return res.status(404).json({ msg: 'Evidence not found' }).end()
    }

    await deleteEvidence(evidenceDB)

    return res.json({ msg: 'Delete OK' }).end()
  } catch (error) {
    next(error)
  }
}
