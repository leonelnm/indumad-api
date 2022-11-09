import { isGestor } from '../helper/utils.js'
import { checkJobAssignToEmployee } from '../services/job.service.js'
import { validateIdField } from '../validations/fieldValidator.js'

export const userAssignJobOrGestorJobParam = async (req, res, next) => {
  try {
    const { role, id } = req.user
    if (isGestor({ role })) {
      req.user.isGestor = true
      return next()
    }

    const { error, value: jobId } = validateIdField(req.params.id)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    if (await checkJobAssignToEmployee({ userId: id, jobId })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}

export const userAssignJobOrGestorJobBody = async (req, res, next) => {
  try {
    const { role, id } = req.user
    if (isGestor({ role })) {
      req.user.isGestor = true
      return next()
    }

    const { jobId: jobIdBody } = req.body
    const { error, value: jobId } = validateIdField(jobIdBody)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }
    if (await checkJobAssignToEmployee({ userId: id, jobId })) {
      next()
    } else {
      return res.status(401).send({ msg: 'Insufficient Permission' })
    }
  } catch (error) {
    next(error)
  }
}
