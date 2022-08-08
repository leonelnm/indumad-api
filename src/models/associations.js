import { Role } from './role.model.js'
import { User } from './user.model.js'

// Association one-to-many, rolas has multiple users and user has a role
Role.hasMany(User)
User.belongsTo(Role, { as: 'role' })
