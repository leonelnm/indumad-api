import { Client } from '../models/client.model.js'

export const createClient = async (client) => {
  return await Client.create(client)
}

export const findClient = async ({ nif }) => {
  if (nif) {
    return await Client.findOne({ where: { nif } })
  }

  return null
}
