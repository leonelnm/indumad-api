import { compare } from '../helper/compare.js'
import { toGuildOrReferencedUpdate } from '../helper/converter.js'
import { createGuild, deleteGuild, findAll, findGuild } from '../services/guild.service.js'
import { validateGuildSchemaOnCreate, validateGuildSchemaOnUpdate, validateNameParemeter } from '../validations/guildSchemaValidator.js'

export const findAllHandler = async (req, res, next) => {
  try {
    const { status } = req.query
    const where = status !== undefined ? { status } : {}

    const response = await findAll(where)
    // const users = userdbListToForm(response)
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
      await createGuild({ name })
      return res.status(201).json({ msg: `Guild ${name} created` }).end()
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

    const guildDB = await findGuild(name)
    if (!guildDB) {
      return res.status(404).json({ msg: `Guild: ${name} not found` }).end()
    }

    const { changes, objectDB: guildToUpdate } = compare(guildDB, toGuildOrReferencedUpdate({ dataFromRequest }))

    if (changes) {
      await guildToUpdate.save(Object.keys(dataFromRequest))
      return res.json(await guildToUpdate.reload()).end()
    }

    return res.json(guildToUpdate).end()
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

    const response = await deleteGuild(name)
    if (response === 0) {
      return res.status(404).json({ msg: `Guild: ${name} not found` }).end()
    }

    return res.json({ msg: `Guild: ${name} deleted` }).end()
  } catch (error) {
    next(error)
  }
}
