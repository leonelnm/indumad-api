import { Contact } from '../models/contact.model.js'

export const createContact = async (contact = undefined) => {
  if (contact) {
    return await Contact.create(contact)
  }

  return null
}

export const findContactByPk = async (id) => {
  return await Contact.findByPk(id)
}
