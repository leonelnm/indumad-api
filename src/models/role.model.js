import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Role extends Model { }

Role.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    unique: {
      msg: 'Role.name duplicado'
    },
    allowNull: false
  }

}, {
  sequelize: dbInstance,
  timestamps: false,
  tableName: 'role',
  defaultScope: {
    attributes: {
      exclude: ['id']
    }
  }
})
