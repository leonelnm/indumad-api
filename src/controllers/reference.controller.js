import { compare } from '../helper/compare.js'
import { toGuildOrReferencedUpdate } from '../helper/converter.js'
import { createReference, deleteReference, findAll, findReference } from '../services/reference.service.js'
import { validateGuildSchemaOnCreate, validateGuildSchemaOnUpdate, validateNameParemeter } from '../validations/guildSchemaValidator.js'

export const findAllHandler = async (req, res, next) => {
  try {
    const { status } = req.query
    const where = status !== undefined ? { status } : {}

    const response = await findAll(where)
    return res.json(response).end()
  } catch (error) {
    next(error)
  }
}

export const createHandler = async (req, res, next) => {
  const { name: nameFromRequest } = req.body

  try {
    const { error, name } = validateGuildSchemaOnCreate({ name: nameFromRequest })
    if (error) {
      return res.status(400).json({ msg: error }).end()
    } else {
      await createReference({ name })
      return res.status(201).json({ msg: `Reference ${name} created` }).end()
    }
  } catch (error) {
    next(error)
  }
}

export const updateHandler = async (req, res, next) => {
  const { error, value: name } = validateNameParemeter(req.params.name)
  if (error) {
    return res.status(400).json({ msg: error }).end()
  }

  try {
    const { error, value: dataFromRequest } = validateGuildSchemaOnUpdate(req.body)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const referenceDB = await findReference(name)
    if (!referenceDB) {
      return res.status(404).json({ msg: `Reference: ${name} not found` }).end()
    }

    const { changes, objectDB: referenceToUpdate } = compare(referenceDB, toGuildOrReferencedUpdate({ dataFromRequest }))

    if (changes) {
      await referenceToUpdate.save(Object.keys(dataFromRequest))
      return res.json(await referenceToUpdate.reload()).end()
    }

    return res.json(referenceToUpdate).end()
  } catch (error) {
    next(error)
  }
}

export const deleteHandler = async (req, res, next) => {
  try {
    const { error, value: name } = validateNameParemeter(req.params.name)
    if (error) {
      return res.status(400).json({ msg: error }).end()
    }

    const response = await deleteReference(name)
    if (response === 0) {
      return res.status(404).json({ msg: `Reference: ${name} not found` }).end()
    }

    return res.json({ msg: `Reference: ${name} deleted` }).end()
  } catch (error) {
    next(error)
  }
}
