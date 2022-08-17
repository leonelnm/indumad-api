import { Client } from './client.model.js'
import { Contact } from './contact.model.js'
import { Job } from './job.model.js'
import { Role } from './role.model.js'
import { User } from './user.model.js'

// Association one-to-many, roles has multiple users and user has a role
Role.hasMany(User)
User.belongsTo(Role, { as: 'role', foreignKey: { name: 'roleId' } })

// Association one-to-one, job - contact
Contact.hasOne(Job)
Job.belongsTo(Contact, { as: 'contact' })

// Association one-to-many, job - client
Client.hasMany(Job)
Job.belongsTo(Client, { as: 'client' })

// Association one-to-many, job - client
User.hasMany(Job)
Job.belongsTo(User, { as: 'employee' })
