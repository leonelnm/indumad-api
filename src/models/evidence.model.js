import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Evidence extends Model { }

Evidence.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(200),
    allowNull: false
  }

}, {
  sequelize: dbInstance,
  tableName: 'evidence',
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  defaultScope: {
    attributes: {
      exclude: [
        'JobId',
        'jobId',
        'UserId',
        'ownerId'
      ]
    }
  }
})
