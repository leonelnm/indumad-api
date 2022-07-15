import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Role extends Model { }

Role.init({

  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false }

}, {
  sequelize: dbInstance,
  timestamps: false
})
