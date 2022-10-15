import { Client } from './client.model.js'
import { Contact } from './contact.model.js'
import { Guild } from './guild.model.js'
import { Job } from './job.model.js'
import { Note } from './notes.model.js'
import { Reference } from './reference.model.js'
import { Role } from './role.model.js'
import { User } from './user.model.js'

// --- USER --- //
// Association one-to-many, roles has multiple users and user has a role
Role.hasMany(User)
User.belongsTo(Role, { as: 'role', foreignKey: { name: 'roleId' } })

User.belongsToMany(Guild, { as: 'guilds', through: 'user_guilds' })
Guild.belongsToMany(User, { as: 'users', through: 'user_guilds' })

// --- JOB --- //
// Association one-to-one, job - contact
Contact.hasOne(Job)
Job.belongsTo(Contact, { as: 'contact' })

// Association one-to-many, job - client
Client.hasMany(Job)
Job.belongsTo(Client, { as: 'client' })

// Association one-to-many, user - job
User.hasMany(Job)
Job.belongsTo(User, { as: 'employee' })

// Association one-to-many, job - guild
Guild.hasMany(Job)
Job.belongsTo(Guild, { as: 'guild' })

// Association one-to-many, job - reference
Reference.hasMany(Job)
Job.belongsTo(Reference, { as: 'reference' })

// Association one-to-many, job - note
Job.hasMany(Note)
Note.belongsTo(Job, { as: 'job' })

// Association one-to-many, user - note
User.hasMany(Note)
Note.belongsTo(User, { as: 'owner' })
