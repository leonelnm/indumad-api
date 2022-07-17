import { dbInstance } from '../config/database.js'
import { Role } from './role.model.js'
import { User } from './user.model.js'

// Relación N-M Un usuario puede tener muchos roles y un role muchos usuarios
const userRole = dbInstance.define('User_Role',
  {}, { timestamps: false, tableName: 'user_role' })

User.belongsToMany(Role, { as: 'roles', through: userRole })
Role.belongsToMany(User, { as: 'users', through: userRole })
